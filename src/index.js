const Eris = require('eris');
const Pluris = require('pluris');
const Signale = require('signale');

const path = require('path');
const fs = require('fs');
const { promisify } = require('util');

const Config = require('../config');

Pluris(Eris, {
    awaitMessages: true,
    awaitReactions: false,
    createDMMessage: false,
    embed: true,
    endpoints: false,
    messageGuild: true,
    roleList: false,
    webhooks: false
});

class Hexabot extends Eris.Client {
    constructor (token, options) {
        super(token, options);

        this.config = Config;

        this.commands = new Map();
        this.aliases = new Map();

        this.cooldowns = new Map();

        this.logger = Signale;

        this.wait = promisify(setTimeout);
    }

    permLevel (message) {
        let permLevel = 0;

        const permOrder = this.config.permLevels.slice(0).sort((p, c) => p.level < c.level ? 1 : -1);

        while (permOrder.length) {
            const currentLevel = permOrder.shift();
            if (currentLevel.check(message)) {
                permLevel = currentLevel.level;
                break;
            }
        }
        return permLevel;
    }

    loadCommand (commandPath, commandName) {
        try {
            const props = new (require(`${commandPath}${path.sep}${commandName}`))(this);
            this.logger.star(`Loading Command: ${props.help.name}`);
            props.conf.location = commandPath;

            this.commands.set(props.help.name, props);
            props.conf.aliases.forEach(alias => {
                this.aliases.set(alias, props.help.name);
            });

            return false;
        } catch (e) {
            return `Unable to load command ${commandName}: ${e}`;
        }
    }

    async unloadCommand (commandPath, commandName) {
        let command;
        if (this.commands.has(commandName)) {
            command = this.commands.get(commandName);
        } else if (this.aliases.has(commandName)) {
            command = this.commands.get(this.aliases.get(commandName));
        }
        if (!command) return `The command \`${commandName}\` doesn"t seem to exist, nor is it an alias. Try again!`;

        delete require.cache[require.resolve(`${commandPath}${path.sep}${commandName}.js`)];
        return false;
    }

    async clean (text) {
        if (text && text.constructor.name == 'Promise')
            text = await text;
        
        if (typeof text !== 'string') 
            text = require('util').inspect(text, { depth: 1 });

        text = text
            .replace(/@/g, '@' + String.fromCharCode(8203))
            .replace(this.config.token, 'BOT_TOKEN');

        return text;
    }
}

const client = new Hexabot(Config.token);

const init = async () => {
    const commandFolders = fs.readdirSync('./src/commands');
    commandFolders.forEach(async (folder) => {
        const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith('.js'));
        commandFiles.forEach(file => {
            const response = client.loadCommand(`./commands/${folder}`, file);
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

process.on('uncaughtException', (err) => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, 'g'), './');
    console.error('Uncaught Exception: ', errorMsg);
    process.exit(1);
});

process.on('unhandledRejection', (err) => {
    console.error('Uncaught Promise Error: ', err);
});