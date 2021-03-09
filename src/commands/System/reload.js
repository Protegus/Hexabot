const Command = require('../../base/Command');

const fs = require('fs');

class Reload extends Command {
    constructor (client) {
        super(client, {
            name: 'reload',
            description: 'Reloads a command',
            usage: 'reload <command>',
            permLevel: 'Bot Owner'
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

        message.channel.createMessage(`Command \`${command.help.name}\` was reloaded!`);
    }
}

module.exports = Reload;