const { Client } = require('eris');
const Signale = require('signale');
const { promisify } = require('util');
const { readdirSync } = require('fs');

const Config = require('../../config');

const serverConfig = require('../models/serverConfig');

class Hexabot extends Client {
    constructor (token, options) {
        super(token, options);

        this.config = Config;

        this.commands = new Map();
        this.aliases = new Map();

        this.db = serverConfig;

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
            const props = new (require(`${commandPath}/${commandName}`))(this);
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

        delete require.cache[require.resolve(`${commandPath}/${commandName}.js`)];
        return false;
    }

    loadUtilityFunctions () {
        this.logger.pending('Loading Utility Functions');

        const utilFiles = readdirSync('./src/util');
        utilFiles.forEach(utilFileName => {
            const utilName = utilFileName.split('.js')[0];
            this.logger.note(`Loading utility: ${utilName}`);

            this[utilName] = require(`../util/${utilFileName}`);
        });
    }

    async clean (text) {
        if (text && text.constructor.name == 'Promise')
            text = await text;
        
        if (typeof text !== 'string') 
            text = require('util').inspect(text, { depth: 1 });

        const tokenRegex = new RegExp(`${this.config.token}`, 'g');
        
        text = text
            .replace(/@/g, '@' + String.fromCharCode(8203))
            .replace(tokenRegex, 'BOT_TOKEN');
        return text;
    }

    async setupConfig (guild) {
        const modRoleId = guild.roles.find(r => r.name.toLowerCase() === 'moderator') || null;
        const adminRoleId = guild.roles.find(r => r.name.toLowerCase() === 'admin')
            || guild.roles.find(r => r.name.toLowerCase() === 'administrator') || null; 

        const serverConfig = new this.db({
            _id: guild.id,
            prefix: '?',
            modRole: modRoleId,
            adminRole: adminRoleId
        });

        await serverConfig.save();

        return serverConfig;
    }
}

module.exports = Hexabot;