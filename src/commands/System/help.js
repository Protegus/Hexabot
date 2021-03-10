const Eris = require('eris');
const fs = require('fs');

const Command = require('../../base/Command');

class Help extends Command {
    constructor (client) {
        super(client, {
            name: 'help',
            description: 'Lists all commands, or information about a specific command.',
            usage: 'help [command]',
            aliases: ['halp', 'h']
        });
    }

    async run (message, args) {
        if (!args.length) {
            let embed = new Eris.RichEmbed()
                .setColor('#F1C40F')
                .setTitle('❓ Help Me! ❓')
                .setDescription('To view information about a specific command, please run `?help [command]`\n\nPrefix: `?`')
                .setTimestamp();

            const commandFolders = fs.readdirSync('./src/commands');
            commandFolders.forEach(folder => {
                const commands = fs.readdirSync(`./src/commands/${folder}`);
                const commandNames = [];

                commands.forEach(cmd => {
                    const commandName = cmd.split('.')[0];
                    commandNames.push(commandName.charAt(0).toUpperCase() + commandName.slice(1));
                });

                embed.addField(`${folder}`, `\`${commandNames.join('` | `')}\``);
            });

            message.channel.createMessage({ embed: embed });
        } else {
            const command = this.client.commands.get(args[0].toLowerCase()) || this.client.commands.get(this.client.aliases.get(args[0].toLowerCase()));
            if (!command) {
                // Return an error embed
            } 

            //Display the information
        }
    }
}

module.exports = Help;