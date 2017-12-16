var mongoose = require('mongoose');

var tempSchema = mongoose.Schema({
    name: String,
    image: String,
    description: String
});

module.exports = mongoose.model("Temp", tempSchema);