const mongoose = require('mongoose');

let SequenceSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    sequence_value: { type: Number, required: true }

});

const Sequence = mongoose.model('sequences', SequenceSchema);
module.exports = Sequence;