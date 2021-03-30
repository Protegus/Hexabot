const Eris = require('eris');

const ModerationCommand = require('../../base/ModerationCommand');

class Unban extends ModerationCommand {
    constructor (client) {
        super(client, {
            name: 'unban',
            description: 'Unbans a user from the server.',
            usage: 'unban <user> [reason]',
            guildOnly: true,
            args: true
        });
    }

    async execute (message, args) {
        const user = await this.client.resolveUser(args[0]);
        if (!user) {
            const embed = new Eris.RichEmbed()
                .setColor(this.client.enum.colors.RED)
                .setTitle('Cannot Find User')
                .setDescription('I cannot find the specified user. Try mentioning them or supplying their user id.')
                .setTimestamp();

            return message.channel.createMessage({ embed: embed });
        }

        // Still in progress
    }
}

module.exports = Unban;