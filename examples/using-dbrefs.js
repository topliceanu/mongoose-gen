/**
 * This example shows how you can generate a mongoose.Schema instance that
 * references documents from other schemas. For simplicity, this example will
 * use mongoose-gen to generate the referred schema, but you can provide schemas
 * from other sources.
 * See test/generator.js for more details.
 *
 * Use:
 * $ npm install mongoose
 * $ npm install mongoose-gen
 * $ # make sure you have mongodb running on 27017.
 * $ node using-dbrefs.js
 */

mongoose = require('mongoose');
generator = require('mongoose-gen');


mongoose.connect('mongodb://localhost:27017/test-mongoose-gen-dbrefs');

var userJson = {
    'fullName': {type: 'String'},
    'age': {type: 'Number'},
    'friend': {type: 'ObjectId', ref: 'User'}
};

var UserSchema = new mongoose.Schema(generator.convert(userJson));
var UserModel = mongoose.model('User', UserSchema);


var friend = new UserModel({'fullName': 'friend', 'age': 28});
friend.save(function (error) {
    if (error) return console.log('error: ', error);

    var me = new UserModel({'fullName': 'me', 'age': 28, 'friend': friend});
    me.save(function (error) {
        if (error) return console.log('error: ', error);
        UserModel.find(function (error, users) {
            if (error) return console.log('error: ', error);
            console.log('users:', users);
            process.exit();
        });
    });
});
