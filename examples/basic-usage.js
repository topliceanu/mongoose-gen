/**
 * This example shows how you can take a simple json document and
 * generate a mongoose.Schema instance from it.
 * See test/generator.js for more details.
 *
 *
 * Use:
 * $ npm install mongoose
 * $ npm install mongoose-gen
 * $ # make sure you have mongodb running on 27017.
 * $ node basic-usage.js
 */

mongoose = require('mongoose');
generator = require('mongoose-gen');


mongoose.connect('mongodb://localhost:27017/test-mongoose-gen-basic');

var userJson = {
    'fullName': {type: 'String'},
    'age': {type: 'Number', validate: 'humanAge'}
};

generator.setValidator('humanAge', function (value) {
    return (value > 0 && value < 130)
});

var UserSchema = new mongoose.Schema(generator.convert(userJson));
var UserModel = mongoose.model('User', UserSchema);

var me = new UserModel({'fullName': 'me', 'age': 28});
//var veryOldMe = new UserModel({'fullName': 'me', 'age': 280}); // Triggers validation error!

me.save(function (error) {
    if (error) return console.log('error: ', error);
    UserModel.find(function (error, users) {
        if (error) return console.log('error: ', error);
        console.log('users:', users);
        process.exit();
    });
});
