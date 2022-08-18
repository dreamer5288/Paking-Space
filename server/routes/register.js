const express = require('express');
const validator = require('validator');

const router = express.Router();
const User = require('../models/user.js');

const nodemailer = require('nodemailer');
const {transporter,sendEmail} = require('../email.js')

router.get('/', (req,res) => {
    res.send("Register Screen!")
})

router.post('/', async (req,res) => {
    const {name,username,email,phone,password,category} = req.body
    let code;
    try {
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

        if(!validator.isMobilePhone(phone)) {
            code = 3
            throw new Error('Phone Number is invalid')
        }

        await User.find()
        .then((users) => {
            users.forEach(user => {
                if(user.username === username) {
                    code = 1
                    throw new Error('this username is taken.')
                }
                if(user.email === email) {
                    code = 2
                    throw new Error('this email id is already registered.')
                }
            })
        })

        const user = new User({
            name : name,
            username : username,
            email : email,
            phone : phone,
            password : password,
            category : category
        });
        
        await user.save();

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Registration successful',
            text: 'Thanks for registering!'
        };
        sendEmail(transporter,mailOptions);

        res.status(200).send('success');
    } catch (error) {
       if(error.message) {
           res.status(200).send({code : code, error : error.message});
       } else {
           res.status(400).send(error);
       }
    }
})

module.exports = router;