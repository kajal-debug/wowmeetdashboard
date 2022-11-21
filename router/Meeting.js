const express = require('express');
const uuid = require('uuid');
const { body, validationResult } = require('express-validator');
const Meeting = require('../models/MeetingModel');
const User = require('../models/UserModel');
const Sequence = require('../models/SequencesModel');

const router = express.Router();

// company_id: company_id, meetingName: meetingname, users: usersList, meetingDate: meetingDate, meetingTime: meetingTime
router.post('/createMeeting', [body('meetingName').notEmpty().withMessage(' Meeting name is Required')], async (request, response) => {
    let errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(401).json({ errors: errors.array() })
    }
    try {
        let { company_id, meetingName, users, meetingDate, meetingTime,files } = request.body;

        let meeting = await Meeting.findOne({ meetingName: meetingName });
        if (meeting) {
            return response.status(401).json({ errors: [{ msg: 'Meeting is Already Exists', meeting: meeting }] });
        }
        else {
            const query = { _id: "seq_meetings" };
            const update = { $inc: { sequence_value: 1 } };
            const options = { new: true };
            let doc = await Sequence.findOneAndUpdate(query, update, options);
            meeting_id = doc.sequence_value;


            meeting = new Meeting({ company_id: company_id, meetingName: meetingName, users: users, meetingDate: meetingDate, meetingTime: meetingTime, meeting_id: meeting_id ,files:files});
            meeting = await meeting.save();
            response.status(200).json({ msg: 'Meeting is Successfully created', id: meeting_id });
        }
    }
    catch (error) {
        console.error(error);
        return response.status(500).json({ errors: [{ msg: error.message }] });
    }
});

router.post('/fetchMeetings', [body('company_id').notEmpty().withMessage(' company_id is Required')], async (request, response) => {
    let errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(401).json({ errors: errors.array() })
    }
    try {
        let { company_id } = request.body;
        console.log("request body", request.body)

        let meetings = await Meeting.find({ company_id: company_id });
        if (meetings) {
            return response.status(200).json({ meetings: meetings });
        }
       
    }
    catch (error) {
        console.error(error);
        return response.status(500).json({ errors: [{ msg: error.message }] });
    }
});

router.post('/fetchMeetingDetails', [body('meeting_id').notEmpty().withMessage(' Meeting id is Required')], async (request, response) => {
    let errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(401).json({ errors: errors.array() })
    }
    try {
        let { meeting_id } = request.body;
        console.log("fetchMeeting - request: ", request.body)

        let meeting = await Meeting.findOne({ meeting_id: meeting_id });
        if (meeting) {
            return response.status(200).json({ meeting: meeting });
        }
    }
    catch (error) {
        console.error(error);
        return response.status(500).json({ errors: [{ msg: error.message }] });
    }
});

router.post('/updateMeeting', [body('_id').notEmpty().withMessage('_id is Required')],
    async (request, response) => {
        let errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(401).json({ errors: errors.array() })
        }

        let { users, _id } = request.body;
        console.log("request body", request.body)

        // console.log("data frm froted",Meetingname,new Date().getTime())
        var datanewusers = [];
        let meeting = await Meeting.find({ _id: _id })
        
        if (meeting) {
            console.log("userId", meeting, request.body.users, datanewusers)
            meeting.map((item) => {
                var adduser = item.userId
                console.log("backenditem", item.userId, request.body.users)
                var newuser = [...adduser, request.body.users]
                console.log("newuser", newuser)
                return datanewusers = newuser;
            })
            console.log("newuser+", datanewusers)

            let users = await Meeting.updateOne({ _id: _id }, {
                $set: {
                    userId: datanewusers
                }
            }, function (err, res) {
                if (err) {
                    response.status(401).json({ error: "upladed", err: err })
                } else {
                    let dataofview = Meeting.find({ _id: _id }).then((item) => {
                        console.log("item", item)
                        response.status(200).json({ msg: "successfully upladed", res: item })
                    })
                    console.log("res+++++++", dataofview)
                }
            });

        }
    }

);

module.exports = router;