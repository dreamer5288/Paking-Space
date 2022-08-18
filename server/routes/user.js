const express = require('express');
const validator = require('validator');

const router = express.Router();
const User = require('../models/user.js');

router.get('/findUserById', async (req,res) => {
    const _id = req.query.id;
    try {
        const user = await User.findOne({_id: _id}).exec();
        if(user) res.status(200).json({user});
        else throw new Error('user not found');
    } catch (error) {
        res.status(400).json({error : error.message});
    }
})

router.put('/updateUserProfile', async (req,res) => {
    const user = req.body;
    try {

        const {_id, name, username, email, phone, password} = user
        if(validator.isEmpty(name)) {
            code = 0
            throw new Error('Name feild is mandatory')
        }

        if(validator.isEmpty(username)) {
            code = 1
            throw new Error('User Name feild is mandatory')
        }

        if(validator.isEmpty(email)) {
            code = 2
            throw new Error('Email feild is mandatory')
        }

        if(validator.isEmpty(phone)) {
            code = 3
            throw new Error('Contact Number feild is mandatory')
        }

        if(validator.isEmpty(password)) {
            code = 4
            throw new Error('Password feild is mandatory')
        }

        if(!validator.isEmail(email)) {
            code = 2
            throw new Error('Email is invalid')
        }

        if(!validator.isMobilePhone(phone) || phone.length < 10) {
            code = 3
            throw new Error('Phone Number is invalid')
        }

        const updatedUser = await User.findByIdAndUpdate({_id : _id}, user, {
            new : true
        })

        res.status(200).json({user : updatedUser});
    } catch (error) {
        if(error.message && code) {
            res.status(200).json({code : code, error : error.message});
        } else {
            res.status(400).json({error});
        }
    }
})

router.get('/getAll', async (req,res) => {
    try {
        await User.find({}, async (err, users) => {
            if(err) {
                throw new Error('failed to load data and to send')
            } else {
                res.status(200).json({users : users})
            }
        })
    } catch(error) {
        
            res.status(400).json(error);
        
    }
})

module.exports = router;
