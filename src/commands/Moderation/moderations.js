const Eris = require('eris');

const ModerationCommand = require('../../base/ModerationCommand');

class Moderations extends ModerationCommand {
    constructor (client) {
        super(client, {
            name: 'moderations',
            description: 'Displays all case logs against a user.',
            usage: 'moderations <user>',
            guildOnly: true,
            args: true,
            aliases: ['mods', 'cases']
        });
    }

    async execute (message, args) {
        const userInfo = this.client.resolveUser(args[0]);
        if (!userInfo) {
            const embed = new Eris.RichEmbed()
                .setColor(this.client.enum.colors.RED)
                .setTitle('Cannot Find User')
                .setDescription('I cannot the specified user. Please mention them or supply their user id.')
                .setTimestamp();
            
            return message.channel.createMessage({ embed: embed });
        }

        const cases = this.client.db.caseLogs.findById(message.guildID).moderations.filter(moderation => moderation.target === userInfo.id);
        if (!cases[0]) {
            // User has no cases against them
            const embed = new Eris.RichEmbed()
                .setColor(this.client.enum.colors.GREEN)
                .setTitle('User has no cases!')
                .setDescription('The specified user doesn\'t have any cases against them!')
                .setTimestamp();
            
            return message.channel.createMessage({ embed: embed });
        }

        const embed = new Eris.RichEmbed()
            .setColor(this.client.enum.colors.GOLD)
            .setTitle(`Case logs for ${userInfo.username}#${userInfo.discriminator}`)
            .setDescription(`This user has ${cases.length} case logs against them.`)
            .setTimestamp();

        cases.forEach(moderation => {
            embed.addField(`Case #\`${moderation.caseNumber}\``, `**Moderation Type:** \`${moderation.moderationType}\`\n**Moderator:** <@${moderation.moderator}>\n**Reason:** \`${moderation.reason}\``);
        });

        message.channel.createMessage({ embed: embed });
    }
}

module.exports = Moderations;