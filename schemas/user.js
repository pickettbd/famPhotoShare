var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({
    name: {
    	first: String,
	last: String
    },
    username: String,
    email: String,
    password: String,
    groups: [ String ]
});

module.exports = mongoose.model('User', userSchema);
