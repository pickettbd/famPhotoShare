var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/memshare');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
    console.log("connected successfully");
}); 
var Schema = mongoose.Schema;
var imageSchema = new Schema({
    name: String,    
	img: { data: Buffer, contentType: String }
});

module.exports = mongoose.model('Image', imageSchema);
