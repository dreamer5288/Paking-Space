const express = require('express');
const validator = require('validator');
const router = express.Router();

const ParkingSpace = require('../models/parkingSpace.js');
const User = require('../models/user.js')
const ParkingRecord = require('../models/parkingRecord.js') 

const nodemailer = require('nodemailer');
const {transporter,sendEmail} = require('../email.js')


router.post('/', async (req, res) => {

    const { userID,row, column} = req.body
    let code,users=[]
    
    try {
        if(validator.isEmpty(row) || row < 1) {
            code = 0
            throw new Error('row feild is mandatory and should be greate than 0')
        }

        if(validator.isEmpty(column) || column < 1) {
            code = 1
            throw new Error('column feild is mandatory and should be greate than 0')
        }

        
        await User.updateMany({},
            {
                spaceid : null
            }
        )

        try {
            await ParkingSpace.find({}, async (err, parkingSpaces) => {
                if(err) {
                    throw new Error('failed to load data and to send')
                } else {
                    for(let parking of parkingSpaces){
                        if(parking.status==false)continue;

                        const record = new ParkingRecord({
                            spaceid : parking.spaceid,
                            entrydate : parking.entrydate,
                            exitdate : new Date(),
                            vehiclenumber : parking.vehiclenumber 
                        })
                
                        await record.save()

                        try {
                            const user = await User.findOne({_id: parking.userid}).exec();
                            if(user){
                                const mailOptions = {
                                    from: process.env.EMAIL,
                                    to: user.email,
                                    subject: 'Booking terminated',
                                    text: 'Your booking has been terminated due to some reconstruction work.'
                                };
                                sendEmail(transporter,mailOptions);
                            } 
                            else throw new Error('user not found');
                        } catch (error) {
                            throw new Error('error');
                        }
                    }
                }
            })
        } catch(error) {
            throw new Error('error while inserting data') 
        }

        await ParkingSpace.deleteMany({}).then(function(){ 
            console.log("Data deleted") 
            // Success 
        }).catch(function(error){
            throw new Error('error while deleting data') 
            // Failure 
        });

        for(var i=1; i<=row; i++){
            for(var j=1; j<=column; j++){

                const saveParkingSpace = async (spaceId) => {
                    const parkingSpace = new ParkingSpace({
                        spaceid : spaceId
                    })
                    await parkingSpace.save()
                }

                const spaceId = 'space_' + i + '_' + j;
                await saveParkingSpace(spaceId)
            }
        }

        try {
            const newUser = await User.findOne({_id: userID}).exec();
            if(newUser) res.status(200).json({user: newUser});
            else throw new Error('user not found');
        } catch (error) {
            res.status(400).json({error : error.message});
        }
    } catch (error) {
        if(error.message) {
            res.status(200).json({code : code, error : error.message});
        } else {
            res.status(400).json(error);
        }
    }

})

module.exports = router;