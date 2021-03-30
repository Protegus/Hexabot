const Eris = require('eris');

const ModerationCommand = require('../../base/ModerationCommand');

class RemoveCase extends ModerationCommand {
    constructor (client) {
        super(client, {
            name: 'removeCase',
            description: 'Removes a case log from the server\'s cases.',
            usage: 'removeCase <case number>',
            guildOnly: true,
            args: true,
            aliases: ['rmCase', 'deleteCase']
        });
    }

    async execute(message, args) {
        const caseLog = message.caseLogs.moderations.find(moderation => moderation.caseNumber == args[0]);
        if (!caseLog) {
            const embed = new Eris.RichEmbed()
                .setColor(this.client.enum.colors.RED)
                .setTitle('Cannot Find Case')
                .setDescription('I cannot the specified case log in this server.')
                .setTimestamp();

            return message.channel.createMessage({ embed: embed });
        }

        await this.client.db.caseLogs.findByIdAndUpdate(message.guildID, { $pull: {
            moderations: {
                caseNumber: caseLog.caseNumber
            }
        }});
        
        const embed = new Eris.RichEmbed()
            .setColor(this.client.enum.colors.GREEN)
            .setTitle('Deleted Case')
            .setDescription(`I have deleted case number \`${caseLog.caseNumber}\`!`)
            .setTimestamp();

        message.channel.createMessage({ embed: embed });
    }
}

module.exports = RemoveCase;