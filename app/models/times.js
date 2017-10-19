var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var timeSchema = new Schema({
    time: Number,
    kid_id : {type : Schema.Types.ObjectId, ref: 'Kid'}
});

module.exports = mongoose.model('Time', timeSchema);
