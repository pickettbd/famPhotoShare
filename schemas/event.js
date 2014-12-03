var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/memshare');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
    console.log("connected successfully");
}); 
var Schema = mongoose.Schema;
var eventSchema = new Schema({
    name: String,    
    photos: [String],
	group: String
});

module.exports = mongoose.model('Event', eventSchema);
