const mongoose = require('mongoose');

let ComapnySchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    company_name: { type: String, required: true },
    user_type: { type: String, required: true },
    company_id: { type: String },
    _status: { type: String, default: 'REG' }

}, { timestamps: true });

const Company = mongoose.model('collection_companies', ComapnySchema);
module.exports = Company;