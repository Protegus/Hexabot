const Command = require('../../base/Command');

class Ping extends Command {
    constructor (client) {
        super(client, {
            name: 'ping',
            description: 'Latency and API response times.',
            usage: 'ping',
            aliases: ['pong'],
        });
    }

    async run (message) {
        try {
            const msg = await message.channel.createMessage('🏓 Ping!');
            msg.edit(`🏓 Pong! (Roundtrip took: ${msg.createdAt - message.createdAt}ms. 💙: ${Math.round(message.channel.guild.shard.latency)})`);
        } catch (e) {
            this.client.logger.error(e);
        }
    }
}

module.exports = Ping;