
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var parentSchema = new Schema({
	userName: String,
	password : String
});

module.exports = mongoose.model('Parent', parentSchema);