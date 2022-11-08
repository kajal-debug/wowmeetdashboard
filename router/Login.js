const express = require('express');
const app = express();
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticate = require('../middlewares/authenticate');
const Company = require('../models/CompanyModel');
var http = require('http'),
    fs = require('fs');


router.post('/login', [
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
            // company: {
            //     id: company.id,
            //     name: company.name
            // }
        };
        jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '5m' }, (err, token) => {
            if (err) throw err;
            response.status(200).json({
                msg: 'Login is Success',
                token: token,
                // company: company,
                user:user
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
// router.post('/auth', authenticate, async (request, response) => {
//     // console.log("user",authenticate,response)
//     try {
        
// // fs.readFile('./src/dashboard/index.html', function (err, html) {
// //     if (err) {
// //         throw err; 
// //     }       
// //     http.createServer(function(request, response) {  
// //         response.writeHeader(200, {"Content-Type": "text/html"});  
// //         response.write(html);  
// //         response.end();  
// //     })
// // });
// //          app.use(express.static(__dirname + "/src/"));
// //          const link = document.createElement('a');
// //   link.setAttribute('class', 'nav-item');

// //   link.href = 'http://127.0.0.1:5501/src/dashboard/index.html';
// //   link.click();
//         // let user = await User.findById(request.user.id).select('-password');
//         // response.status(200).json({ user: user });
//     }
//     catch (error) {
//         console.error(error);
//         response.status(500).json({ errors: [{ msg: error.message }] });
//     }
// });

module.exports = router;