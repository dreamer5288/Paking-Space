const mongoose = require('mongoose');

const parkingSpaceSchema = mongoose.Schema({
    spaceid : {
        type : String,
        required : true
    },
    
    status : {
        type : Boolean,
        required : true,
        default : false
    },

    userid : {
        type : String,
        default : null
    },

    exitdate : {
        type : Date,
        default : null
    },

    entrydate : {
        type : Date,
        default : null
    },

    vehiclenumber : {
        type : String,
        default : null
    }

});

const ParkingSpace = mongoose.model('ParkingSpace', parkingSpaceSchema);

module.exports = ParkingSpace;