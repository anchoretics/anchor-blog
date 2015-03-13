var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var ChatSchema = new mongoose.Schema({
	message: String,
	format: String,
	hostname: String,
	hostaddress: String,

	user: { 
		type: ObjectId,
		ref: 'User'
	},

	meta: {
		createAt: {
			type: Number, 
			max: 13,
			default: new Date().getTime()
		},
		updateAt: {
			type: Number, 
			max: 13,
			default: new Date().getTime()
		},
		location: {
	 		x: String,
	 		y: String,
	 		z: String
		}
	}

});

var Chat = mongoose.model('Chat',ChatSchema);
module.exports = Chat;