const express = require('express');
const validator = require('validator');

const router = express.Router();
const ParkingSpace = require('../models/parkingSpace.js');
const User = require('../models/user.js');
const ParkingRecord = require('../models/parkingRecord.js') 

const nodemailer = require('nodemailer');
const {transporter,sendEmail} = require('../email.js')

router.get('/getAll', async (req,res) => {
    // res.send("Register Screen for Parking space to Admin only!")
    try {
        await ParkingSpace.find({}, async (err, parkingSpaces) => {
            if(err) {
                throw new Error('failed to load data and to send')
            } else {
                res.status(200).json({parkingspaces : parkingSpaces})
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

router.get('/getDimensions', async (req,res) => {
    try {
        const parkingSpaces = await ParkingSpace.find({}).exec()
        if(!parkingSpaces.length) {
            throw new Error('failed to load data')
        } else {
            const lastId = parkingSpaces[parkingSpaces.length - 1].spaceid.split('_')
            res.status(200).json({row : lastId[1], column : lastId[2]})
        }

    } catch(error) {
        
            res.status(400).json({error : error.message});
        
    }
})

router.get('/getOne', async (req,res) => {
    spaceid = req.query.spaceid ;
    try {
        await ParkingSpace.find({spaceid: spaceid}, async (err, space) => {
            if(err) {
                throw new Error('failed to load data and to send for specific spaceid')
            } else {
                res.status(200).json({space})
            }
        })
    } catch(error) {
        if(error.message) {
            res.status(200).json({code : code, error : error.message});
        } else {
            res.status(400).json(error);
        }
    }
})

router.get('/find', async (req,res) => {
    try {
        const space = await ParkingSpace.findOne({status : false}).exec()
        if(!space) {
            res.status(200).json({error : "no parking spaces are currently available"})
        }
        res.status(200).json({space})
    } catch(error) {
        res.status(400).json({error : error.message})
    }
})

router.get('/isActiveParking' , async (req,res) => {
    try {
        const spaceid = req.query.spaceid 
        const parkingSpace = await ParkingSpace.findOne({spaceid : spaceid}).exec()
        if(parkingSpace.exitdate < new Date()) {
            res.status(200).json({status : "expired", vehiclenumber : parkingSpace.vehiclenumber})
        } 
        else res.status(200).json({status : "active", vehiclenumber : parkingSpace.vehiclenumber , exitdate : parkingSpace.exitdate})
    } catch (error) {
        res.status(400).json({error : error.message})
    }
})

router.put('/confirmParking', async (req,res) => {
    const {spaceid, userid, exitdate, entrydate, vehiclenumber, email} = req.body
    let code;
    try {
        if(validator.isEmpty(spaceid)) {
            code = 0
            throw new Error('Space ID feild is mandatory')
        }

        if(validator.isEmpty(vehiclenumber)) {
            code = 4
            throw new Error('vechical Number feild is mandatory')
        }

        const parkingSpace = await ParkingSpace.findOne({spaceid : spaceid}).exec()
        if(parkingSpace.status && parkingSpace.userid != userid) {
            throw new Error('This parking spot has been taken!!')
        }
        
        //I don't know how to check validations for car license plate

        await ParkingSpace.findOneAndUpdate(
            { spaceid: spaceid }, 
            {   status: true, 
                userid : userid, 
                exitdate : exitdate, 
                entrydate : entrydate, 
                vehiclenumber : vehiclenumber }, 
            { new : true }
        );

        const updatedUser = await User.findOneAndUpdate(
            {_id : userid},
            {spaceid : spaceid},
            {new : true}
        )

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Booking successful',
            text: 'Your booking has been confirmed!'
        };
        sendEmail(transporter,mailOptions);

        res.status(200).json({user : updatedUser});
    } catch (error) {
       if(error.message) {
           res.status(200).send({code : code, error : error.message});
       } else {
           res.status(400).send(error);
       }
    }
})

router.put('/updateParking', async (req,res) => {
    const {spaceid, exitdate, email} = req.body
    try {
        const updatedParkingSpace = await ParkingSpace.findOneAndUpdate({spaceid : spaceid}, {
            exitdate : exitdate
        },{new  : true});

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Booking updated',
            text: 'Your booking has been updated!'
        };
        sendEmail(transporter,mailOptions);

        res.status(200).send({message : "success"})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
})

router.put('/terminateParking', async (req,res) => {
    const {spaceid, userid, email} = req.body
    try {

        const refferedParking = await ParkingSpace.findOne({spaceid : spaceid}).exec()

        const record = new ParkingRecord({
            spaceid : spaceid,
            entrydate : refferedParking.entrydate,
            exitdate : new Date(),
            vehiclenumber : refferedParking.vehiclenumber 
        })

        await record.save()

        const cancelledParkingSpace = await ParkingSpace.findOneAndUpdate({spaceid : spaceid}, {
            status : false,
            userid : null,
            entrydate : null,
            exitdate : null,
            vehiclenumber : null
        }, {new  : true});

        const updatedUser = await User.findOneAndUpdate({_id : userid}, {
            spaceid : null
        }, {new  : true})

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Booking terminated',
            text: 'Your booking has been terminated!'
        };
        sendEmail(transporter,mailOptions);

        // console.log(updatedUser)

        res.status(200).json({user : updatedUser})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
})

module.exports = router;