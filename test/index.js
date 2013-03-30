var assert = require('assert');
var fs = require('fs');

var mongoose = require('mongoose');

var descriptor = require('./fixtures/descriptor.json');
var generator = require('./../');
var util = require('./../lib/util.js');


describe( 'mongoose schema generator', function () {

	it('should add a validator', function () {
		var customFn = function () {
			return true;
		};
		var customName = 'customValidator';
		generator.setValidator(customName, customFn);
		assert.equal(generator._hash.validator[customName], customFn);
	});

	it('should add a customSetter', function () {
		var customFn = function (value) {
			return value;
		};
		var customName = 'customSet';
		generator.setSetter(customName, customFn);
		assert.equal(generator._hash.setter[customName], customFn);
	});

	it('should add a customGetter', function () {
		var customFn = function (value) {
			return value;
		};
		var customName = 'customGet';
		generator.setGetter(customName, customFn);
		assert.equal(generator._hash.getter[customName], customFn);
	});

	it('should add a defaultString', function () {
		var customFn = function () {
			return 'default';
		};
		var customName = 'defaultString';
		generator.setDefault(customName, customFn);
		assert.equal(generator._hash.default[customName], customFn);
	});

	it('should add defaults', function () {
		['String', 'Number', 'Boolean', 'Date', 'Buffer', 'ObjectId', 'Mixed'].forEach( function (type) {
			var name = 'default'+type;
			var fn = function () {
				switch (type) {
					case 'String': return 'default';
					case 'Number': return 1;
					case 'Boolean': return true;
					case 'Date': return new Date(111111111111111);
					case 'Buffer': return new Buffer('default');
					case 'ObjectId': return 1;
					case 'Mixed': return {};
				}
			};
			generator.setDefault(name, fn);
			assert.equal(generator._hash.default[name], fn);
		});
	});

	it('should retrieve the correct function', function () {
		generator._get('validator', 'customValidator')
	});

	it('should match the correct type', function () {
		var Type1 = generator._matchType('String')
		var Type2 = generator._matchType('Number')
		var Type3 = generator._matchType('Boolean')
		var Type4 = generator._matchType('Date')
		var Type5 = generator._matchType('Buffer')
		var Type6 = generator._matchType('ObjectId')
		var Type7 = generator._matchType('Mixed')

		assert.equal(Type1, String);
		assert.equal(Type2, Number);
		assert.equal(Type3, Boolean);
		assert.equal(Type4, Date);
		assert.equal(Type5, Buffer);
		assert.equal(Type6, mongoose.Schema.ObjectId);
		assert.equal(Type7, mongoose.Types.Mixed);
	});


	it('should return a regexp when match options is given', function () {
		var r = generator._check('match', '^test$');
		assert.ok(r.test('test'));
	});
});


describe('convert the json into a mongoose schema', function () {

	before( function () {
        this.descriptor = descriptor;
	});

	it('should not work if it does not have a connection', function () {
		assert.throws( function () {
			generator.schema('TestSchema', this.descriptor);
		});
	});

	it('should set a correct connection object', function () {
		assert.doesNotThrow( function () {
			generator.setConnection(mongoose);
		});
	});

	it('should return a mongoose.Model instance', function () {
		var definition = generator._convert(this.descriptor);
		this.Model = generator.schema('TestSchema', this.descriptor);
		assert.ok(util.is('Function', this.Model));
	});

	it('should permit creating a new object', function (done) {
		var doc = new this.Model();
		assert.equal(doc.prop1, 'default');
		assert.equal(doc.prop2, 1);
		assert.equal(doc.prop3, true);
		assert.equal(doc.prop4.getTime(), (new Date(111111111111111)).getTime());
		assert.equal(doc.prop5.toString('UTF-8'), 'default');
		doc.save();
		done();
	});
});
