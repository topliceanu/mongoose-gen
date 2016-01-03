/**
 * This example shows how you can generate a mongoose.Schema instance from
 * json document with nested values. These can be both nested arrays and
 * objects. See test/generator.js for more details.
 *
 * Use:
 * $ npm install mongoose
 * $ npm install mongoose-gen
 * $ # make sure you have mongodb running on 27017.
 * $ node nested-models.js
 */

mongoose = require('mongoose');
generator = require('mongoose-gen');


mongoose.connect('mongodb://localhost:27017/test-mongoose-gen-nested');

var userJson = {
    'fullName': {type: 'String'},
    'age': {type: 'Number'},
    'hobbies': [{
        'name': {'type': 'string'}
    }]
};

var UserSchema = new mongoose.Schema(generator.convert(userJson));
var UserModel = mongoose.model('User', UserSchema);

var me = new UserModel({
    'fullName': 'me',
    'age': 28,
    'hobbies': [
        {'name': 'painting'},
        {'name': 'piano'},
        {'name': 'theatre'}
    ]
});

me.save(function (error) {
    if (error) return console.log('error: ', error);
    UserModel.find(function (error, users) {
        if (error) return console.log('error: ', error);
        console.log('users:', users);
        process.exit();
    });
});
