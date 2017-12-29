var mongoose = require('mongoose');

var postSchema = mongoose.Schema({
    name: String,
    image: String,
    description: String
});

module.exports = mongoose.model("Post", postSchema);