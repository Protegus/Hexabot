const { Schema, model } = require('mongoose');

const caseLogs = new Schema({
    _id: String,
    moderations: [{
        caseNumber: Number,
        moderationType: String,
        moderator: String,
        target: String,
        reason: String,
        date: Date
    }]
});

module.exports = model('CaseLogs', caseLogs);