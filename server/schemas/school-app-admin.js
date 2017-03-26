var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var schoolAppAdmin = new Schema({
    id: {type: String, unique: true},
    name: {type: String, required: true},
    username : {type: String, required: true},
    password : {type: String, required: true}
});

module.exports =  mongoose.model('schoolAppAdmin', schoolAppAdmin);