const Eris = require('eris');
const Pluris = require('pluris');
const Signale = require('signale');
const Mongoose = require('mongoose');

const fs = require('fs');

const Config = require('../config');

Mongoose.connect(Config.mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
const dbConnection = Mongoose.connection;

dbConnection.once('open', () => Signale.success('MongoDB Connected!'));

const Hexabot = require('./base/Hexabot');

Pluris(Eris, {
    awaitMessages: false,
    awaitReactions: false,
    createDMMessage: false,
    embed: true,
    endpoints: false,
    messageGuild: true,
    roleList: false,
    webhooks: false
});


const client = new Hexabot(Config.token);

const init = async () => {
    const commandFolders = fs.readdirSync('./src/commands');
    commandFolders.forEach(async (folder) => {
        const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith('.js'));
        commandFiles.forEach(file => {
            const response = client.loadCommand(`../commands/${folder}`, file);
            if (response) client.logger.error(response);
        });
    });

    const eventFiles = fs.readdirSync('./src/events').filter(file => file.endsWith('.js'));
    client.logger.pending(`Loading a total of ${eventFiles.length} events.`);
    eventFiles.forEach(file => {
        const eventName = file.split('.')[0];
        client.logger.note(`Loading Event: ${eventName}`);
        const event = new (require(`./events/${file}`))(client);

        client.on(eventName, (...args) => event.run(...args));
        delete require.cache[require.resolve(`./events/${file}`)];
    });

    client.levelCache = {};
    client.config.permLevels.forEach(level => {
        client.levelCache[level.name] = level.level;
    });

    client.loadUtilityFunctions();

    client.connect();
};

init();

client.on('disconnect', () => client.logger.warn('Bot is disconnecting...'))
    .on('reconnecting', () => client.logger.note('Bot is reconnecting...'))
    .on('error', e => client.logger.error(e))
    .on('warn', info => client.logger.warn(info));

Array.prototype.random = function () {
    return this[Math.floor(Math.random() * this.length)];
};

String.prototype.toProperCase = function () {
    return this.replace(/([^\W_]+[^\s-]*) */g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};

process.on('uncaughtException', (err) => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, 'g'), './');
    console.error('Uncaught Exception: ', errorMsg);
    process.exit(1);
});

process.on('unhandledRejection', (err) => {
    console.error('Uncaught Promise Error: ', err);
});