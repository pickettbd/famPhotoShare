var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var groupSchema = new Schema({
    name: String,    
    //events: [{type: Schema.ObjectId, ref: 'Event'}],
    events: [ { name: String, photos: [ String ] } ],
    users: [String]
});

module.exports = mongoose.model('Group', groupSchema);
