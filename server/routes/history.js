const express = require('express');
const router = express.Router();
const ParkingRecord = require('../models/parkingRecord.js') 

router.get('/getHistory', async (req,res) => {
    try {
        await ParkingRecord.find({}, async (err, parkingrecords) => {
            if(err) {
                throw new Error('Failed to load data')
            } else {
                res.status(200).json({parkingrecords : parkingrecords})
            }
        })
    } catch(error) {
        if(error.message) {
            res.status(200).json({error : error.message});
        } else {
            res.status(400).json(error);
        }
    }
})

module.exports = router