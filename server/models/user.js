const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name : {
        type : String,
        required : true
    },

    username : {
        type : String,
        required : true,
        unique : true
    },
    
    email : {
        type : String,
        required : true,
        unique : true
    },

    phone : {
        type : String,
        required : true,
        unique : true
    },
    
    password : {
        type : String,
        required : true
    },

    spaceid : {
        type : String,
        default : null
    },

    category : {
        type : String,
        required : true
    }

});

const User = mongoose.model('User', userSchema);

module.exports = User;