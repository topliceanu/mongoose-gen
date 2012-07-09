mongoose-gen
============
[![Build Status](https://secure.travis-ci.org/topliceanu/mongoose-gen.png?branch=master)](http://travis-ci.org/topliceanu/mongoose-gen)


Gist
----

**mongoose-gen** generates mongoose schemas from json documents


Installation
------------

    npm install mongoose-gen


Development and Running Tests
-----------------------------
	
	git clone git@github.com:topliceanu/mongoose-gen.git
	cd mongoose-gen
	npm install
	npm test


Usage Example
-------------

book.json

	{
		"title": {"type": "String", "trim": true, "index": true, "required": true},
		"year": {"type": "Number", "max": 2012, "validate": "validateBookYear"},
		"author": {"type": "ObjectId", "ref": "Author", "index": true, "required": true}
	}


index.js
 
	var generator = require('mongoose-gen');
	var fs = require('fs');

	var mongoose = require('mongoose');
	mongoose.connect('mongodb://localhost/test');

	// configuration
	generator.setConnection(mongoose); // make sure you connected
	generator.setValidator('validateBookYear', function (value) {
		return true;
	});

	// load json
	fs.readFile('book.json', 'UTF-8', function (err, data) {
		if (err) throw err;
		try {
			var json = JSON.parse(data);
			var Book = generator.schema('Book', json);
			/* 
				Book is an instance of type mongoose.Model
				It has been registered with mongoose under the name 'Book', you can retrieve it by mongoose.model('Book');
				If you need the Schema object, use Book.schema
			*/
		}
		catch(exception) {
			throw exception;
		}
	});

For more examples of use, see the tests in `test/index.js`


Supported Schema Types and Options
----------------------------------

**mongoose-gen** aims for the optimal transformation of json documents into mongoose schemas.

However some features cannot be represented in json very well (particulary function validators, setters, getters or defaults) so this utility is using strings that identify pre-registered functions.

Types are expected as strings in the json document and will be converted acordingly (case insensitive). Supported types (and their options) are:


* **String**
    - lowercase: Boolean
    - uppercase: Boolean
    - trim: Boolean
    - match: String - expects a string that will be passed to new Regexp() constructor
    - enum: [String]

* **Number**
    - min: Number
    - max: Number

* **Boolean**

* **Date**

* **Buffer**

* **ObjectId**
    - ref: String - the name of the Model to reference [Required]

* **Mixed**

* **Additional Type Options**
    - type: String - a type from one of the above [Required]
    - _default_: String - identifier of a previously registered default
    - required: Boolean
    - select: Boolean
    - _get_: String - identifier of a previously registered getter
    - _set_: String - identifier of a previously registered setter 
    - index: Boolean
    - unique: Boolean
    - sparse: Boolean
    - _validate_: String - identifier of a previously registered getter


**NOTE** Only the types and options defined above are permitted, unrecognized values are whitelisted or generate and exception!


API
---

	generator.setConnection(mongoose: mongoose.Connection): undefined // REQUIRED before compiling a json descriptor

	generator.setValidator(validator: Function): undefined

	generator.setDefault(default: Function): undefined

	generator.setSetter(getter: Function): undefined

	generator.setGetter(setter: Function): undefined

	generator.schema(name: String, json: Object): mongoose.Model


Setters, Getters, Defaults and Validators
-------------------------------
	
Setters, Getters, Defaults and Validators must be pre-registered as such with the `generator` instance.

**mongoose-gen** uses the name under which these were registered to look them up and add them to the mongoose.Schema

The registered name are global to all generated schemas so you can reuse them.


	var generator = require('mongoose-gen');

	generator.addSetter( mySetter, function (value) { .. }); // return a new value
	generator.addGetter( myGetter, function (value) { .. }); // return a new value
	generator.addDefault( myDefault, function (value) { .. }); // return a new value
	generator.addValidator( myValidator, function (value) { .. }); // return Boolean


In the `usage` section above you can see an example of defining a validator.


Inspiration
-----------

* [mongoose-from-json-schema](https://github.com/work-in-progress/mongoose-from-json-schema)

* [json-mongoose-schemadef](https://github.com/adityab/json-mongoose-schemadef)


Licence
-------

(The MIT License)

Copyright (c) 2009-2011 Alex Topliceanu alexandru (dot) topliceanu (at) gmail (dot) com

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

