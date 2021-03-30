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
        const user = await this.client.resolveUser(this.client, args[0]);
        if (!user) {
            const embed = new Eris.RichEmbed()
                .setColor(this.client.enum.colors.RED)
                .setTitle('Cannot Find User')
                .setDescription('I cannot find the specified user. Try mentioning them or supplying their user id.')
                .setTimestamp();

            return message.channel.createMessage({ embed: embed });
        }

        const guildBans = await message.guild.getBans();
        const banInfo = guildBans.find(ban => ban.user.id === user.id);

        if (!banInfo) {
            const embed = new Eris.RichEmbed()
                .setColor(this.client.enum.colors.RED)
                .setTitle('Cannot Find Banned User')
                .setDescription('I could not find the specified banned user. Either the person you specified isn\'t banned, or you didn\'t provide a valid user. Please either mention the user or provide their user id.')
                .setTimestamp();

            return message.channel.createMessage({ embed: embed });
        }

        let description = `I have successfully unbanned \`${user.username}#${user.discriminator}\``;

        const reason = args[1] ? args.slice(1).join(' ') : null;
        if (reason) description += `\n\nReason: \`${reason}\``;

        await message.guild.unbanMember(user.id, reason);

        const embed = new Eris.RichEmbed()
            .setColor(this.client.enum.colors.GREEN)
            .setTitle('Unbanned User')
            .setDescription(description)
            .setTimestamp();

        message.channel.createMessage({ embed: embed });
    }
}

module.exports = Unban;