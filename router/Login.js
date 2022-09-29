const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticate = require('../middlewares/authenticate');
const Company = require('../models/Company');

router.post('/employeelogin', [
    body('name').notEmpty().withMessage('admin name is Required'),
    body('email').notEmpty().withMessage('Email is Required'),
    body('password').notEmpty().withMessage('Password is Required'),
], async (request, response) => {
    let errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(401).json({ errors: {msg:"please fill the requrement"}  })
    }
    console.log("value",request.body)
    try {
        console.log("value",request.body)
        let { email, password,name } = request.body;
        console.log("value",request.body)
        let user = await User.findOne({ email: email });
        if (!user) {
            return response.status(401).json({ errors: { msg: 'email Invalid Credentials' }})
        }
        // check password
        let isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return response.status(401).json({ errors: { msg: 'password missmatch' }})
        }
         
        if (name != user.name) {
            return response.status(401).json({ errors: { msg: ' name Invalid Credentials' }})
        }
        // create a token
        let payload = {
            user: {
                id: user.id,
                name: user.name
            }
        };
        jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: 360000000 }, (err, token) => {
            if (err) throw err;
            response.status(200).json({
                msg: 'Login is Success',
                token: token
            });
        })
        if(response.status(200)){
            console.log("hii login user")
        }
    }
    catch (error) {
        console.error(error);
        response.status(500).json({ errors: { msg: error.message } });
    }
});

router.post('/login', [
    body('adminname').notEmpty().withMessage('adminname name is Required'),
    body('email').notEmpty().withMessage('Email is Required'),
    body('password').notEmpty().withMessage('Password is Required'),
], async (request, response) => {
    let errors = validationResult(request);
    if (!errors.isEmpty()) {
         response.status(401).json({ errors: {msg:"please fill the requrement"} })
         console.log("errors$%",errors.errors)
    }
    try {
        let { email, password,adminname } = request.body;
        let company = await Company.findOne({ email: email });
        if (!company) {
            return response.status(401).json({ errors: { msg: 'email Invalid Credentials' } })
        }
        // check password
        let isMatch = await bcrypt.compare(password, company.password);
        if (!isMatch) {
            return response.status(401).json({ errors: { msg: 'password missmatch' } })
        }
         
        if (adminname != company.adminname) {
            return response.status(401).json({ errors: { msg: ' name Invalid Credentials' }})
        }
        // create a token
        let payload = {
            company: {
                id: company.id,
                name: company.name
            }
        };
        jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: 360000000 }, (err, token) => {
            if (err) throw err;
            response.status(200).json({
                msg: 'Login is Success',
                token: token,
                company_id:company.company_id
            });
        })
        if(response.status(200)){
            console.log("hii login company")
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


router.get('/', authenticate, async (request, response) => {
    try {
        let user = await User.findById(request.user.id).select('-password');
        response.status(200).json({ user: user });
    }
    catch (error) {
        console.error(error);
        response.status(500).json({ errors: [{ msg: error.message }] });
    }
});

module.exports = router;