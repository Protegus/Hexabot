const Eris = require('eris');

const ModerationCommand = require('../../base/ModerationCommand');

class Ban extends ModerationCommand {
    constructor (client) {
        super(client, {
            name: 'ban',
            description: 'Bans a member from the server.',
            usage: 'ban <member> [reason]',
            guildOnly: true,
            args: true,
            aliases: ['banhammer']
        });
    }

    async execute (message, args) {
        const member = this.client.resolveMember(message, args[0]);
        if (!member) {
            const embed = new Eris.RichEmbed()
                .setColor(this.client.enum.colors.RED)
                .setTitle('Cannot Find Member')
                .setDescription('I cannot find the specified member. Try mentioning them or supplying their user id.')
                .setTimestamp();

            return message.channel.createMessage({ embed: embed });
        }

        let description = `I have successfully kicked \`${member.username}#${member.discriminator}\``;

        const reason = args[1] ? args.slice(1).join(' ') : null;
        if (reason) description += `\n\nReason: \`${reason}\``;

        await member.ban(1, reason);

        await this.logCase(message.caseLogs, {
            moderationType: 'ban',
            moderator: message.author.id,
            target: member.id,
            reason: reason || 'No reason provided.'
        });

        const embed = new Eris.RichEmbed()
            .setColor(this.client.enum.colors.GREEN)
            .setTitle('Banned Member!')
            .setDescription(description)
            .setTimestamp();
        
        message.channel.createMessage({ embed: embed });
    }
}

module.exports = Ban;