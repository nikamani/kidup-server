
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var kidSchema = new Schema({
	name: String,
	parent_id:  {type : Schema.Types.ObjectId, ref: 'Parent'}
});

module.exports = mongoose.model('Kid', kidSchema);