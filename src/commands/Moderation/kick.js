const Eris = require('eris');

const ModerationCommand = require('../../base/ModerationCommand');

/*class Kick extends Command {
    constructor (client) {
        super(client, {
            name: 'kick',
            description: 'Kicks a member from a server.',
            usage: 'kick <member> [reason]',
            guildOnly: true,
            args: true,
            permLevel: 'Moderator',
            aliases: ['boot']
        });
    }

    async run (message, args) {
        // args could be a mention, name, or user id
        const member = this.client.resolveMember(message, args[0]);
        if (!member) {
            // return embedded message
            const embed = new Eris.RichEmbed()
                .setColor(this.client.enum.colors.RED)
                .setTitle('Cannot Find Member!')
                .setDescription('I cannot find this member! Try mentioning them or supplying their user ID!')
                .setTimestamp();

            return message.channel.createMessage({ embed: embed });
        }

        let description = `I have successfully kicked \`${member.username}#${member.discriminator}\``;

        const reason = args[1] ? args.slice(1).join(' ') : null;
        if (reason) description += `\n\nReason: \`${reason}\``;

        member.kick(reason);

        // return embedded message
        const embed = new Eris.RichEmbed()
            .setColor(this.client.enum.colors.GREEN)
            .setTitle('Kicked Member!')
            .setDescription(description)
            .setTimestamp();
        
        message.channel.createMessage({ embed: embed });
    }
}*/

class Kick extends ModerationCommand {
    constructor (client) {
        super(client, {
            name: 'kick',
            description: 'Kicks a member from the server.',
            usage: 'kick <member> [reason]',
            guildOnly: true,
            args: true,
            permLevel: 'Moderator',
            aliases: ['boot']
        });
    }

    async run (message, args) {
        const member = this.client.resolveMember(message, args[0]);
        if (!member) {
            const embed = new Eris.RichEmbed()
                .setColor(this.client.enum.colors.RED)
                .setTitle('Cannot Find Member!')
                .setDescription('I cannot find this member! Try mentioning them or supplying their user ID!')
                .setTimestamp();

            return message.channel.createMessage({ embed: embed });
        }

        let description = `I have successfully kicked \`${member.username}#${member.discriminator}\``;

        const reason = args[1] ? args.slice(1).join(' ') : null;
        if (reason) description += `\n\nReason: \`${reason}\``;

        console.log(reason);
        member.kick(reason);

        this.logCase(message.guildData, {
            moderationType: 'kick',
            moderator: message.author.id,
            target: member.id,
            reason: reason || 'No reason provided.'
        });

        // return embedded message
        const embed = new Eris.RichEmbed()
            .setColor(this.client.enum.colors.GREEN)
            .setTitle('Kicked Member!')
            .setDescription(description)
            .setTimestamp();
        
        message.channel.createMessage({ embed: embed });
    }
}

module.exports = Kick;