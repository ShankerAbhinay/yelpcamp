const mongoose 	 = require('mongoose');

//Schema setUp
var capmpgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String,
	comments:[
		{
			type:mongoose.Schema.Types.ObjectId,
			ref: "Comment" //This is the name of the model
		}
	]
});

module.exports = mongoose.model("Campground",capmpgroundSchema);