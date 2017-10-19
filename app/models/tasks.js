
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var taskSchema = new Schema({
	kid_id:  {type : Schema.Types.ObjectId, ref: 'Kid'},
	parent_id:  {type : Schema.Types.ObjectId, ref: 'Parent'},
	description: String,
	time: Number,
	registed: Boolean
});

module.exports = mongoose.model('Task', taskSchema);