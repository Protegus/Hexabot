const Eris = require('eris');

const ModerationCommand = require('../../base/ModerationCommand');

class Case extends ModerationCommand {
    constructor (client) {
        super(client, {
            name: 'case',
            description: 'Displays information about a specific moderation case.',
            usage: 'case <case number>',
            guildOnly: true,
            args: true,
            aliases: ['moderation']
        });
    }

    async execute (message, args) {
        const caseInfo = message.caseLogs.moderations.find(moderation => moderation.caseNumber == args[0]);

        if (!caseInfo) {
            const embed = new Eris.RichEmbed()
                .setColor(this.client.enum.colors.RED)
                .setTitle('Cannot find case')
                .setDescription('I cannot find the supplied the case number. Please try again.')
                .setTimestamp();

            return message.channel.createMessage({ embed: embed });
        }

        const embed = new Eris.RichEmbed()
            .setColor(this.client.enum.colors.GREEN)
            .setTitle('Case Information')
            .setDescription(`Information for case number: \`${args[0]}\``)
            .addField('Moderation Type', `${caseInfo.moderationType}`, true)
            .addField('Moderator', `<@${caseInfo.moderator}>`, true)
            .addField('Target', `<@${caseInfo.target}>`, true)
            .addField('Reason', `${caseInfo.reason}`, true)
            .addField('Date', `${caseInfo.date}`, true)
            .setTimestamp();

        message.channel.createMessage({ embed: embed });
    }
}

module.exports = Case;