module.exports = class {
    constructor (client) {
        this.client = client;
    }

    async run (message) {
        if (message.author.bot) return;

        if (message.guildID && !message.channel.permissionsOf(this.client.user.id).has('sendMessages')) return;

        const prefixMention = new RegExp(`^<@!?${this.client.user.id}> ?$`);
        if (message.content.match(prefixMention)) {
            return message.channel.createMessage('My prefix is `?`');
        }

        if (!message.content.startsWith('?')) return;

        const args = message.content.slice(1).trim().split(/ +/g);
        const command = args.shift().toLowerCase();

        if (message.guildID && !message.member) await message.channel.guild.fetchMembers({ userIDs: [message.author.id] });

        const level = this.client.permLevel(message);

        const cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command));
        if (!cmd) return;

        
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
                return message.channel.createMessage(`Please wait ${timeLeft.toFixed(1)} more seconds before running the \`${command}\` command.`);
            }
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

        if (!message.guildID && cmd.conf.guildOnly) 
            return message.channel.createMessage('This command is unavailable via private message. Please run this command in server.');

        if (level < this.client.levelCache[cmd.conf.permLevel])
            return message.channel.createMessage('You do not have permission to use this command.');

        if (cmd.args && !args.length) {
            let reply = 'You didn\'t provide any arguments!';

            if (cmd.usage) {
                reply += `\nThe proper usage would be: \`?${cmd.usage}`;
            }

            return message.channel.createMessage(reply);
        }

        message.author.permLevel = level;

        cmd.run(message, args);
    }
};