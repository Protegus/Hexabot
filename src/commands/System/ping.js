const Eris = require('eris');

const Command = require('../../base/Command');

class Ping extends Command {
    constructor (client) {
        super(client, {
            name: 'ping',
            description: 'Latency and API response times.',
            usage: 'ping',
            aliases: ['pong']
        });
    }

    async run (message) {
        try {
            const msg = await message.channel.createMessage('Calculating ping...');

            const embed = new Eris.RichEmbed()
                .setColor('#2ECC71')
                .setTitle('🏓 Pong!')
                .addField('Roundtrip', `${msg.createdAt - message.createdAt}ms`, true)
                .addField('Heartbeat', message.guild ? `${Math.round(message.guild.shard.latency)}ms` : `${this.client.shards.get(0).latency}`, true)
                .setTimestamp();

            msg.edit({ embed: embed });
        } catch (e) {
            this.client.logger.error(e);
        }
    }
}

module.exports = Ping;