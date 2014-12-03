var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/memshare');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
    console.log("connected successfully");
}); 
var Schema = mongoose.Schema;
var groupSchema = new Schema({
    name: String,    
    events: [{type: Schema.ObjectId, ref: 'Event'}],
    users: [String]
});

module.exports = mongoose.model('Group', groupSchema);
