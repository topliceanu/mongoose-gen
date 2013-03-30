var util = require('./util.js');
var mongoose = require('mongoose');


var Schema = mongoose.Schema;
var Mixed = mongoose.Types.Mixed;
var ObjectId = mongoose.Schema.ObjectId;
var connection;


// functions hash
var hash = {
	validator: {},
	setter: {},
	getter: {},
	default: {}
};


var set = function (param) {
	return function (key, value) {
		if (!util.is('Function', value)) throw new Error('expected type Function for '+value);
		if (!util.is('String', key)) throw new Error('expected type String for '+key);

		if (param === 'validator') hash.validator[key] = value;
		if (param === 'setter') hash.setter[key] = value;
		if (param === 'getter') hash.getter[key] = value;
		if (param === 'default') hash.default[key] = value;
	};
};


var setConnection = function (_connection) {
	if (!_connection instanceof mongoose.Connection)
		throw new Error('mongoose.Connection expected but got '+_connection);
	connection = _connection;
};


var get = function (param, key) {
	var fn = hash && hash[param] && hash[param][key];
	if (!fn) throw new Error('undefined '+param+' for name '+key);
	return fn;
};


var whitelist = ['lowercase', 'uppercase', 'trim', 'match', 'enum', 'min', 'max', 'ref', 'type', 'default', 'required', 'select', 'get', 'set', 'index', 'unique', 'sparse', 'validate'];


var matchType = function (type) {
	var output;
	switch (type.toLowerCase()) {
		case 'string': output = String; break;
		case 'number': output = Number; break;
		case 'boolean': output = Boolean; break;
		case 'date': output = Date; break;
		case 'buffer': output = Buffer; break;
		case 'objectid': output = ObjectId; break;
		case 'mixed': output = Mixed; break;

		default: throw new Error('unknown type '+type);
	}
	return output;
};


var check = function (type, value) {
	if (type === 'match') {
		if (!util.is('String', value)) throw new Error('expected string for match key');
		return new RegExp(value);
	}
	throw new Error('unexpected type '+type);
};


var convert = function (descriptor) {
	var encoded = JSON.stringify(descriptor);
	var decoded = JSON.parse(encoded, function (key, value) {
		if (key === 'type') return matchType(value);
		if (key === 'validate') return get('validator', value);
		if (key === 'get') return get('getter', value);
		if (key === 'set') return get('setter', value);
		if (key === 'default') return get('default', value);
		if (key === 'match') return check(key, value);
		if (key === '') return value; // toplevel object
		//if (whitelist.indexOf(key) === -1) return;
		return value;
	});
	return decoded;
};


var schema = function (name, descriptor) {
	if (!util.is('String', name)) throw new Error('expected string for param name');
	if (!util.is('Object', descriptor)) throw new Error('expected object for param descriptor');
	if (!connection) throw new Error('expected a mongoose.Connection params. Call setConnection() before schema()');

	var definition = convert(descriptor);
	var schema = new Schema(definition);
    return connection.model(name, schema);
};

// private api, just for testing
exports._hash = hash;
exports._get = get;
exports._matchType = matchType;
exports._check = check;
exports._convert = convert;



// public api
exports.setValidator = set('validator');
exports.setSetter = set('setter');
exports.setGetter = set('getter');
exports.setDefault = set('default');
exports.setConnection = setConnection;
exports.schema = schema;
