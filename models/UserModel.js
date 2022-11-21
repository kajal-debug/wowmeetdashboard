const mongoose = require('mongoose');

let UserSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, required: true },
    password: { type: String, required: true },
    company_name: { type: String },
    avatar : { type: String },
    user_type: { type: String, required: true },
    company_id: { type: String, required: true },
    user_id: { type: String },
    _status: { type: String, default: 'REG' },
}, { timestamps: true });
const User = mongoose.model('collection_users', UserSchema);
module.exports = User;