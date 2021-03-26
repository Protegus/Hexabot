const Eris = require('eris');
const Hastebin = require('hastebin-gen');

const Command = require('../../base/Command');

class Eval extends Command {
    constructor (client) {
        super(client, {
            name: 'eval',
            description: 'Evaluates arbitrary Javascript.',
            usage: 'eval <expression>',
            args: true,
            aliases: ['e', 'ev'],
            permLevel: 'Bot Owner'
        });
    }

    async run (message, args) {
        const code = args.join(' ');
        try {
            const evaled = eval(code);
            const clean = await this.client.clean(evaled);

            const MAX_CHARS = 8 + clean.length;

            if (MAX_CHARS > 1024) {
                const haste = await Hastebin(clean, { url: 'https://snippets.cloud.libraryofcode.org', extension: 'js '});

                const embed = new Eris.RichEmbed()
                    .setColor('#2ECC71')
                    .setTitle('✅ Evaluated Javascript!')
                    .setDescription('Output exceeded the maximum character limit, so I\'ve put it into a hastebin link.')
                    .addField('Output', haste)
                    .setTimestamp();

                message.channel.createMessage({ embed: embed });
            } else {
                const embed = new Eris.RichEmbed()
                    .setColor('#2ECC71')
                    .setTitle('✅ Evaluated Javascript!')
                    .addField('Output', `\`\`\`js\n${clean}\`\`\``)
                    .setTimestamp();

                message.channel.createMessage({ embed: embed });
            }
        } catch (error) {
            const MAX_CHARS = 8 + error.length;
            if (MAX_CHARS > 1024) {
                const haste = await Hastebin(error, { url: 'https://snippets.cloud.libraryofcode.org', extension: 'js' });

                const embed = new Eris.RichEmbed()
                    .setColor('#E74C3C')
                    .setTitle('❌ Javascript Evaluation Error!')
                    .setDescription('Output exceeded the maximum character limit, so I\'ve put it into a hastebin link.')
                    .addField('Output', haste)
                    .setTimestamp();

                message.channel.createMessage({ embed: embed });
            } else {
                const embed = new Eris.RichEmbed()
                    .setColor('#E74C3C')
                    .setTitle('❌ Javascript Evaluation Error!')
                    .addField('Output', `\`\`\`js\n${error}\`\`\``)
                    .setTimestamp();

                message.channel.createMessage({ embed: embed });
            }
        }
    }
}

module.exports = Eval;