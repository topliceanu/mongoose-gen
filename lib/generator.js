var util = require('util');

var _ = require('underscore');
var mongoose = require('mongoose');


// Dict to keep all registered custom validators, setters, getters and defaults.
var hash = {
    validator: {},
    setter: {},
    getter: {},
    default: {}
};


/**
 * Creates functions specialized in registering custom validators, setters,
 * getters and defaults.
 * @param {String} param - one of 'validator', 'setter', 'getter', 'default'
 * @throws Error
 * @return {Function}
 */
var set = function (param) {
    return function (key, value) {
        switch (param) {
            case 'validator':
                hash.validator[key] = value;
                break;
            case 'setter':
                hash.setter[key] = value;
                break;
            case 'getter':
                hash.getter[key] = value;
                break;
            case 'default':
                hash.default[key] = value;
                break;
        }
    };
};


/**
 * Returns a previously registered function.
 * @param {String} param - one of 'validator', 'setter', 'getter', 'default'
 * @param {String} key - the name under which the value was registered.
 * @throws Error
 * @return {Function}
 */
var get = function (param, key) {
    var fn = hash && hash[param] && hash[param][key];
    if (!fn) {
        throw new Error('Unregistered "'+param+'" with name "'+key+'"');
    }
    return fn;
};


// List of all reserved keys used by mongoose in schema definition.
var whitelist = [
    'lowercase',
    'uppercase',
    'trim',
    'match',
    'enum',
    'min',
    'max',
    'ref',
    'type',
    'default',
    'required',
    'select',
    'get',
    'set',
    'index',
    'unique',
    'sparse',
    'validate'
];


/**
 * Converts type names into actual types supported by mongoose.
 * @param {String} type - one of 'string', 'number', 'boolean',
 *                               'date', 'buffer', 'objectid', 'mixed'
 * @throws Error
 * @return {Object}
 */
var matchType = function (type) {
    var output;
    var types = {
        'array': Array,
        'buffer': Buffer,
        'boolean': Boolean,
        'date': Date,
        'mixed': mongoose.Schema.Types.Mixed,
        'number': Number,
        'objectid': mongoose.Schema.ObjectId,
        'string': String,
        'object': Object
    };
    if (types[type.toLowerCase()]) {
        return types[type.toLowerCase()];
    }
    throw new Error('unknown type '+type);
};


/**
 * Function verifies that `value` is a valid parameter of RegExp constructor.
 * @param {String} type
 * @param {String} value
 * @throws Error
 * @return {RegExp}
 */
var check = function (type, value) {
    if (type === 'match') {
        if (!_.isString(value)) {
            throw new Error('expected string for match key');
        }
        return new RegExp(value);
    }
    throw new Error('unexpected type '+type);
};


/**
 * Converts a plain json schema definition into a mongoose schema definition.
 *
 * @param {Object} descriptor
 * @return {Object}
 */
var convert = function (descriptor) {
    var encoded = JSON.stringify(descriptor);
    var decoded = JSON.parse(encoded, function (key, value) {
        if (key === 'type' && (typeof value !== 'object')) {
            return matchType(value);
        }
        if (key === 'validate') {
            return get('validator', value);
        }
        if (key === 'get') {
            return get('getter', value);
        }
        if (key === 'set') {
            return get('setter', value);
        }
        if (key === 'default') {
            return get('default', value);
        }
        if (key === 'match') {
            return check(key, value);
        }
        if (key === '') {
            return value;
        }
        return value;
    });
    return decoded;
};


/**
 * Extend mongoose.Schema to allow schema definition from plain json documents.
 *
 * @class Schema
 * @param {Object} descriptor
 * @param {mongoose.Conenction} connection
 * @param {Object} options
 */
var getSchema = function (descriptor, connection, options) {
    var definition = convert(descriptor);
    return new connection.Schema(definition, options);
};


// Private api, just for testing.
exports._hash = hash;
exports._get = get;
exports._matchType = matchType;
exports._check = check;


// Public api.
exports.setValidator = set('validator');
exports.setSetter = set('setter');
exports.setGetter = set('getter');
exports.setDefault = set('default');
exports.convert = convert;
exports.getSchema = getSchema;
