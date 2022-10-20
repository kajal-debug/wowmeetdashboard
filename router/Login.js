const express = require('express');
const app = express();
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticate = require('../middlewares/authenticate');
// const Company = require('../models/CompanyModel');
var http = require('http'),
    fs = require('fs');


router.post('/login', [
    // body('adminname').notEmpty().withMessage('adminname name is Required'),
    body('email').notEmpty().withMessage('Email is Required'),
    body('password').notEmpty().withMessage('Password is Required'),
], async (request, response) => {
    let errors = validationResult(request);
    if (!errors.isEmpty()) {
         response.status(401).json({ errors: {msg:"please fill the requrement"} })
         console.log("errors$%",errors.errors)
    }
    try {
        let { email, password } = request.body;
        // let company = await Company.findOne({ email: email });
        let user = await User.findOne({ email: email });
        if (!user) {
            return response.status(401).json({ errors: { msg: 'email Invalid Credentials' } })
        }
        // check password
        let isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return response.status(401).json({ errors: { msg: 'password missmatch' } })
        }
         
        // if (adminname != company.adminname) {
        //     return response.status(401).json({ errors: { msg: ' name Invalid Credentials' }})
        // }
        // create a token
        let payload = {
            user: {
                id: user.id,
                name: user.name
            }
        };
        jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '5m' }, (err, token) => {
            if (err) throw err;
            response.status(200).json({
                msg: 'Login is Success',
                token: token,
                // company_id:company,
                user:user
            });
        })
        if(response.status(200)){
            console.log("hii login user")
            // window.localStorage.setItem(
            //     token
            // )
        }
    }
    catch (error) {
        console.error("errorss",error);
        response.status(500).json({ errors: { msg: error.message } });
    }
});
router.post('/auth', authenticate, async (request, response) => {
    // console.log("user",authenticate,response)
    try {
        
    }
    catch (error) {
        console.error(error);
        response.status(500).json({ errors: [{ msg: error.message }] });
    }
});

module.exports = router;