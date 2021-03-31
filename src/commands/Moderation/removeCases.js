const Eris = require('eris');

const ModerationCommand = require('../../base/ModerationCommand');

class RemoveCases extends ModerationCommand {
    constructor (client) {
        super(client, {
            name: 'removeCases',
            description: 'Removes all moderation case logs from a user\'s record.',
            usage: 'removeCases <user>',
            guildOnly: true,
            args: true
        });
    }

    async execute (message, args) {
        const user = await this.client.resolveUser(this.client, args[0]);
        if (!user) {
            const embed = new Eris.RichEmbed()
                .setColor(this.client.enum.colors.RED)
                .setTitle('Cannot Find User')
                .setDescription('I cannot find the specified user. Please either mention them or supply their user id.')
                .setTimestamp();

            return message.channel.createMessage({ embed: embed });
        }

        const usersLogs = message.caseLogs.moderations.find(moderation => moderation.target === user.id);
        if (!usersLogs) {
            const embed = new Eris.RichEmbed()
                .setColor(this.client.enum.colors.GOLD)
                .setTitle('User Has No Logs')
                .setDescription(`${user.username}#${user.discriminator} has no case logs against them!`)
                .setTimestamp();

            return message.channel.createMessage({ embed: embed });
        }

        await this.client.db.caseLogs.findByIdAndUpdate(message.guildID, { $pull: {
            moderations: {
                target: user.id
            }
        }});

        const embed = new Eris.RichEmbed()
            .setColor(this.client.enum.colors.GREEN)
            .setTitle('Removed All Cases')
            .setDescription(`I have removed all case logs for ${user.username}#${user.discriminator}!`)
            .setTimestamp();

        message.channel.createMessage({ embed: embed });
    }
}

module.exports = RemoveCases;