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
        const guildData = await this.client.db.findById(message.guildID);

        if (!args.length) {
            let embed = new Eris.RichEmbed()
                .setColor('#F1C40F')
                .setTitle('❓ Help Me! ❓')
                .setDescription(`To view information about a specific command, please run \`?help [command]\`\n\nPrefix: \`${guildData.prefix}\``)
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
                const embed = new Eris.RichEmbed()
                    .setColor('#E74C3C')
                    .setTitle('❌ Command Not Found!')
                    .setDescription(`${args[0].toProperCase()} is not a valid command nor alias. Please try again!`)
                    .setTimestamp();

                return message.channel.createMessage({ embed: embed });
            } 

            const commandName = command.help.name;
            const commandDescription = command.help.description;
            const commandUsage = command.help.usage;
            const commandAliases = command.conf.aliases;
            const commandGuildOnly = command.conf.guildOnly;
            const commandEnabled = command.conf.enabled;
            const commandPermLevel = command.conf.permLevel;

            const commandFolders = fs.readdirSync('./src/commands');
            const commandCategory = commandFolders.find(folder => fs.readdirSync(`./src/commands/${folder}`).includes(`${commandName}.js`));

            const embed = new Eris.RichEmbed()
                .setColor('#F1C40F')
                .setTitle(`${commandName.toProperCase()}`)
                .setDescription(`${commandDescription}`)
                .addField('Category', `\`${commandCategory}\``, true)
                .addField('Usage', `\`${commandUsage.toProperCase()}\``, true)
                .addField('Guild Only', `\`${commandGuildOnly.toString().toProperCase()}\``, true)
                .addField('Enabled', `\`${commandEnabled.toString().toProperCase()}\``, true)
                .addField('Permission Required', `\`${commandPermLevel.toProperCase()}\``, true)
                .setTimestamp();

            if (commandAliases[0]) embed.addField('Aliases', `\`${commandAliases.map(alias => alias.toProperCase()).join('`, `')}\``, true);

            message.channel.createMessage({ embed: embed });
        }
    }
}

module.exports = Help;