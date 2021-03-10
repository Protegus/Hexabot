const Eris = require('eris');
const fs = require('fs');

const Command = require('../../base/Command');

class Reload extends Command {
    constructor (client) {
        super(client, {
            name: 'reload',
            description: 'Reloads a command',
            usage: 'reload <command>',
            permLevel: 'Bot Owner',
            args: true
        });
    }

    run (message, args) {
        const commandName = args[0].toLowerCase();
        const command = this.client.commands.get(commandName)
            || this.client.commands.get(this.client.aliases.get(commandName));
        
        if (!command) return message.channel.createMessage(`There is no command with name or alias \`${commandName}\`.`);

        const commandFolders = fs.readdirSync('./src/commands');
        const folderName = commandFolders.find(folder => fs.readdirSync(`./src/commands/${folder}`).includes(`${command.help.name}.js`));

        this.client.unloadCommand(`./commands/${folderName}`, command.help.name);
        this.client.loadCommand(`./commands/${folderName}`, command.help.name);

        const embed = new Eris.RichEmbed()
            .setColor('#2ECC71')
            .setTitle('🔄 Reloaded!')
            .setDescription(`I have reloaded command: \`${command.help.name}\``)
            .setTimestamp();

        message.channel.createMessage({ embed: embed });
    }
}

module.exports = Reload;