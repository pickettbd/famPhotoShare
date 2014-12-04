var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var eventSchema = new Schema({
    name: String,    
    photos: [{ data: Buffer, contentType: String }]
});

module.exports = mongoose.model('Event', eventSchema);
