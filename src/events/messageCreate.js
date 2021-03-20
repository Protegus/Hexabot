const Eris = require('eris');

module.exports = class {
    constructor (client) {
        this.client = client;
    }

    async run (message) {
        if (message.author.bot) return;

        if (message.guildID && !message.channel.permissionsOf(this.client.user.id).has('sendMessages')) return;

        let guildData = await this.client.db.findById(message.guildID);
        if (!guildData) {
            guildData = await this.client.setupConfig(message.guild);
        }

        const prefixMention = new RegExp(`^<@!?${this.client.user.id}> ?$`);
        if (message.content.match(prefixMention)) {
            const embed = new Eris.RichEmbed()
                .setColor('#2ECC71')
                .setTitle('❓ Prefix!')
                .setDescription(`The prefix is \`${guildData.prefix}\``)
                .setTimestamp();
            
            return message.channel.createMessage({ embed: embed });
        }

        if (!message.content.startsWith(guildData.prefix)) return;

        const args = message.content.slice(guildData.prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();

        if (message.guildID && !message.member) await message.channel.guild.fetchMembers({ userIDs: [message.author.id] });

        message.guildData = guildData;

        const level = this.client.permLevel(message);

        const cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command));
        if (!cmd) return;

        if (!cmd.conf.enabled) return;

        if (!this.client.cooldowns.has(command)) {
            this.client.cooldowns.set(command, new Map());
        }
        
        const now = Date.now();
        const timestamps = this.client.cooldowns.get(command);
        const cooldownAmount = (cmd.cooldown || 3) * 1000;

        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;

                const embed = new Eris.RichEmbed()
                    .setColor('#F1C40F')
                    .setTitle('⏰ Cooldown!')
                    .setDescription(`Please wait ${timeLeft.toFixed(1)} more seconds before running the \`${command}\` command.`)
                    .setTimestamp();

                return message.channel.createMessage({ embed: embed });
            }
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

        if (!message.guildID && cmd.conf.guildOnly) {
            const embed = new Eris.RichEmbed()
                .setColor('#F1C40F')
                .setTitle('🚫 Guild only command!')
                .setDescription('This command is unavailable via private message. Please run this command in server.')
                .setTimestamp();

            return message.channel.createMessage({ embed: embed });
        }

        if (level < this.client.levelCache[cmd.conf.permLevel]) {
            const embed = new Eris.RichEmbed()
                .setColor('#E74C3C')
                .setTitle('🚫 Permission Denied!')
                .setDescription('You do not have permission to use this command!')
                .setTimestamp();

            return message.channel.createMessage({ embed: embed });
        }

        if (cmd.conf.args && !args.length) {
            const embed = new Eris.RichEmbed()
                .setColor('#E74C3C')
                .setTitle('🗣️ I need more information!')
                .setDescription('You didn\'t provide any arguments!' + cmd.help.usage ? `\n\nThe correct usage would be: \`${cmd.help.usage}\`` : '' )
                .setTimestamp();

            return message.channel.createMessage({ embed: embed });
        }

        message.author.permLevel = level;

        cmd.run(message, args);
    }
};