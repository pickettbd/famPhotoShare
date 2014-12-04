var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/memshare');
var db = mongoose.connection;
var db = mongoose.createConnection('mongodb://localhost/memshare');
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
    console.log("connected successfully in user.js");
}); 
var Schema = mongoose.Schema;
var userSchema = new Schema({
    username: String,
    email: String,
    password: String
});

module.exports = mongoose.model('User', userSchema);
