class Command {
    constructor (client, {
        name = null,
        description = 'No description provided.',
        usage = 'No usage provided.',
        enabled = true,
        guildOnly = false,
        args = false,
        cooldown = 3,
        aliases = new Array(),
        permLevel = 'User'
    }) {
        this.client = client;
        this.conf = { enabled, guildOnly, aliases, permLevel, args, cooldown };
        this.help = { name, description, usage };
    }
}

module.exports = Command;