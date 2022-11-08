const express = require('express');
const app = express();
const router = express.Router();
const { body, validationResult } = require('express-validator');
// const User = require('../models/UserModel');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const authenticate = require('../middlewares/authenticate');
const MeetingNote = require('../models/MeetingNotesModel');


router.post('/saveNotes', [
    body('note').notEmpty().withMessage('note is Required'),
    body('uid').notEmpty().withMessage('User id is Required'),
    body('company_id').notEmpty().withMessage('Company id is Required'),
    body('meeting_id').notEmpty().withMessage('Meeting id is Required'),
], async (request, response) => {
    let errors = validationResult(request);
    if (!errors.isEmpty()) {
        response.status(401).json({ errors: { msg: "please fill the requrement" } })
        console.log("errors$%", errors.errors)
    }
    try {
        let { note, uid, company_id, meeting_id } = request.body;
        console.log("store to the db")
        // insert data
        newNote = new MeetingNote({ note: note, company_id: company_id, user_id: uid, meeting_id: meeting_id });
        newNote = await newNote.save();
        response.status(200).json({ msg: ' is Success' });

        // meetingNoteData();
        // if (response.status(200)) {

        // }
    }
    catch (error) {
        console.error("errorss", error);
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