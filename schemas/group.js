var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://localhost/memshare');
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
    console.log("connected successfully in group.js");
}); 
var Schema = mongoose.Schema;
var groupSchema = new Schema({
    name: String,    
    events: [{type: Schema.ObjectId, ref: 'Event'}],
    users: [String]
});

module.exports = mongoose.model('Group', groupSchema);
