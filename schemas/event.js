var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://localhost/memshare');
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
    console.log("connected successfully in event.js");
}); 
var Schema = mongoose.Schema;
var eventSchema = new Schema({
    name: String,    
    photos: [{ data: Buffer, contentType: String }]
});

module.exports = mongoose.model('Event', eventSchema);
