const mongoose = require('mongoose');
let MeetingSchema = new mongoose.Schema({
    meeting_id: { type: String, unique: true },
    company_id: { type: String},
    meetingName: { type: String},
    users: { type: Array },
    meetingDate: { type: String, required: true },
    meetingTime: { type: String, required: true },
    _status: { type: String, default: 'ACT' }
}, { timestamps: true });
const MeetingModel = mongoose.model('collection_meetings', MeetingSchema);
module.exports = MeetingModel;

