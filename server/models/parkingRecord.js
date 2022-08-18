const mongoose = require('mongoose');

const parkingRecordSchema = mongoose.Schema({
    spaceid : {
        type : String,
        required : true
    },

    entrydate : {
        type : Date,
        default : null
    },

    exitdate : {
        type : Date,
        default : null
    },

    vehiclenumber : {
        type : String,
        default : null
    }
})

const ParkingRecord = mongoose.model('ParkingRecord', parkingRecordSchema);

module.exports = ParkingRecord;