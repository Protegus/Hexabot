const { Schema, model } = require('mongoose');

const perServer = new Schema({
    _id: String,
    prefix: String,
    modRole: String,
    adminRole: String,
});

module.exports = model('ServerConfig', perServer);