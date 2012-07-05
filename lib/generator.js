var util = require('./util.js');
var mongoose = require('mongoose');


var Schema = mongoose.Schema;
var Mixed = mongoose.Types.Mixed;
var ObjectId = mongoose.Schema.ObjectId;


// functions hash
var hash = {
	validators: {},
	setters: {},
	getters: {},
	defaults: {}
};


var set = function (param) {
	return function (key, value) {
		if (!util.is('Function', value)) throw Error('expected type Function for '+value);
		if (!util.is('String', key)) throw Error('expected type String for '+key);

		if (param === 'validator') hash.validators[key] = value;
		if (param === 'setter') hash.setters[key] = value;
		if (param === 'getter') hash.getters[key] = value;
		if (param === 'default') hash.defaults[key] = value;
	};
};


var get = function (param, key) {
	return hash[param][key];	
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


var convert = function (descriptor) {
	return JSON.parse( JSON.stringify(descriptor, whitelist), function (key, value) {
		if (key === 'type') return matchType(value);
		if (key === 'validate') return get('validate', value);
		if (key === 'get') return get('get', value);
		if (key === 'set') return get('set', value);
		if (key === 'default') return get('default', value);
		return value;
	});
};


var schema = function (name, descriptor) {
	var definition = convert(descriptor);
	var schema = new Schema(definition);
	mongoose.model(name, schema);
};


// public api
exports.setValidator = set('validator');
exports.setSetter = set('setter');
exports.setGetter = set('getter');
exports.setDefault = set('default');
exports.schema = schema;
