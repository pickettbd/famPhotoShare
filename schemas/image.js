var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://localhost/memshare');
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
    console.log("connected successfully in image.js");
}); 
var Schema = mongoose.Schema;
var imageSchema = new Schema({
    name: String,    
    img: { data: Buffer, contentType: String }
});

module.exports = mongoose.model('Image', imageSchema);
