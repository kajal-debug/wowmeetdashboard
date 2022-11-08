const mongoose = require('mongoose');

let MeetingNotesSchema = new mongoose.Schema({
    note: { type: String, required: true },
    meeting_id: { type: String, required: true },
    company_id: { type: String, required: true },
    user_id: { type: String, required: true },
    _status: { type: String, default: 'ACT' }

}, { timestamps: true });

const MeetingNotes = mongoose.model('collection_meeting_notes', MeetingNotesSchema);
module.exports = MeetingNotes;