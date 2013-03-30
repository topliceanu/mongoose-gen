var assert = require('assert');

var mongoose = require('mongoose');

var descriptor = require('./fixtures/simple-descriptor.json');
var generator = require('../');
var util = require('../lib/util.js');

describe('Mongoose-gen disk storage', function () {

    before(function () {
        // NOTE: change the connection string if you want to use another
        // database or host.
        mongoose.connect('mongodb://localhost:27017/mongoose-gen-tests');
        generator.setConnection(mongoose);
		this.Model = generator.schema('Test', descriptor);
    });

    afterEach(function (done) {
        // Cleanup the database collection.
        // NOTE: an application cannot delete a database so if you want to keep
        // you mongodb server clean you have to delete the test database manually.
        this.Model.collection.remove(done);
    });

    it('should store the model in the database', function (done) {
        var _this = this;
        var instance = new this.Model({prop1: 'Test'});
        instance.save( function (err) {
            if(err){
                return done(err);
            }
            assert.ok(util.is('String', instance.id), 'instance now has a '+
                             'String id, which means it was saved on disk');
            _this.Model.find(function (err, instances) {
                if(err){
                    return done(err);
                }
                if(!instances || !instances.length || instances.length === 0){
                    return done(new Error('No instances found'));
                }
                instance = instances[0];
                assert.equal(instance.prop1, 'Test', 'same value as the one saved');
                done();
            });
        });
    });

});
