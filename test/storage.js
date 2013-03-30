var assert = require('assert');

var mongoose = require('mongoose');

var descriptor = require('./fixtures/simple-descriptor.json');
var generator = require('../');
var util = require('../lib/util.js');

describe('Mongoose-gen disk storage', function () {

    before(function () {
        // NOTE: change the connection string if you want to use another
        // database or host.
        this.connection = mongoose.connect('mongodb://localhost:27017/mongoose-gen-tests');
        generator.setConnection(this.connection);
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

describe('Cross model storage', function () {

    beforeEach(function () {
        generator.setConnection(mongoose.connection);

        // Define schemas.
        var plainSchema = new mongoose.Schema({
            'key': {type: String}
        });
        var genSchema = {"key": {"type": "String"}};

        // Define models.
        this.PlainModel = mongoose.model('PlainModel', plainSchema);
        this.GenModel = generator.schema('GenModel', genSchema);
    });

    afterEach( function (done) {
        // Cleanup the collections.
        var _this = this;
        this.PlainModel.collection.remove( function (err) {
            if (err) return done(err);
            _this.GenModel.collection.remove(done);
        });
    });

    it('should store data for both normally created models and '+
       '`mongoose-gen` created models the same way', function (done) {
        var _this = this;

        // Create instances.
        var plain = new this.PlainModel({key: 'plain'});
        var gen = new this.GenModel({key: 'gen'});

        // Store the instances.
        plain.save( function (err) {
            if(err) {
                return done(err);
            }
            assert.ok(util.is('String', plain.id), 'plain model is saved!');

            gen.save( function (err) {
                if (err) {
                    return done(err);
                }
                assert.ok(util.is('String', gen.id), 'gen model is saved!');

                // Check if the data is persisted.
                _this.PlainModel.find( function (err, models) {
                    if (err) return done(err);
                    if (!models || !models.length || models.length !== 1)
                        return done(new Error('no plain models stored!'));
                    assert.equal(models[0].key, 'plain');

                    _this.GenModel.find( function (err, models) {
                        if (err) return done(err);
                        if (!models || !models.length || models.length !== 1)
                            return done(new Error('no gen models stored!'));
                        assert.equal(models[0].key, 'gen');
                        done();
                    });
                });
            });
        });
    });

});
