const express = require('express');
const router = express.Router();

// const Meeting = require('../models/Meeting')
const { body, validationResult } = require('express-validator');

const MeetingNote = require('../models/MeetingNotesModel');



router.post('/fetchMeetingsNotes', [
  body('uid').notEmpty().withMessage('User id is Required'),
  body('company_id').notEmpty().withMessage('Company id is Required'),
  body('meeting_id').notEmpty().withMessage('Meeting id is Required'),
], async function (request, response) {
  let errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(401).json({ errors: { msg: "please fill the requrement" } })
  }
  let { uid, company_id, meeting_id } = request.body;

  const meetingNotes = await MeetingNote.find({ company_id: company_id, user_id: uid, meeting_id: meeting_id, _status: "ACT" });

  response.status(200).json({ msg: 'Successfully fetch data', notes: meetingNotes });

});
module.exports = router;