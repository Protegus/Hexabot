const { Schema, model } = require('mongoose');

const perServer = new Schema({
    _id: String,
    prefix: String,
    modRole: String,
    adminRole: String,

    moderations: [{
        caseNumber: Number,
        moderationType: String,
        moderator: String,
        target: String,
        reason: String,
        date: Date
    }]
});

module.exports = model('ServerConfig', perServer);