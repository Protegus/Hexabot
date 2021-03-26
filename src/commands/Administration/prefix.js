const Eris = require('eris');

const Command = require('../../base/Command');

class Prefix extends Command {
    constructor (client) {
        super(client, {
            name: 'prefix',
            description: 'Will change the server\'s prefix',
            usage: 'prefix <new prefix>',
            guildOnly: true,
            args: true,
            permLevel: 'Administrator',
            aliases: ['pre']
        });
    }

    async run (message, args) {
        const newPrefix = args.join(' ').trim();
        await this.client.db.guildSettings.findByIdAndUpdate(message.guildID, { prefix: newPrefix });

        const embed = new Eris.RichEmbed()
            .setColor('#2ECC71')
            .setTitle('Prefix Changed!')
            .setDescription(`I have changed the server's prefix to: \`${newPrefix}\``)
            .setTimestamp();

        message.channel.createMessage({ embed: embed });
    }
}

module.exports = Prefix;