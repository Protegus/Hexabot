const Eris = require('eris');

const Command = require('../../base/Command');

class Random extends Command {
    constructor (client) {
        super(client, {
            name: 'random',
            description: 'Selects a random choice from a list supplied.',
            usage: 'random <option1>, <option2>, etc.',
            args: true,
            aliases: ['choose', 'choice']
        });
    }

    async run (message, args) {
        let options = args.join(' ').split(',').map(item => item.trim());
        const selection = options.random();

        const embed = new Eris.RichEmbed()
            .setColor(this.client.enum.colors.GREEN)
            .setTitle('Random Selection!')
            .setDescription(`I have chose the option: \`${selection}\`!\n\nChoices given: \`${options.join('`, `')}\``)
            .setTimestamp();

        message.channel.createMessage({ embed: embed });
    }
}

module.exports = Random;