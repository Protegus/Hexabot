module.exports = class {
    constructor (client) {
        this.client = client;
    }

    async run (guild) {
        const confExists = await this.client.db.exists({ _id: guild.id });
        if (confExists) {
            await this.client.db.findByIdAndDelete(guild.id);
        }

        this.client.setupConfig(guild);
    }
};