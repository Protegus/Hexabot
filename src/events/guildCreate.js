module.exports = class {
    constructor (client) {
        this.client = client;
    }

    async run (guild) {
        const confExists = await this.client.db.guildSettings.exists({ _id: guild.id });
        if (confExists) {
            await this.client.db.guildSettings.findByIdAndDelete(guild.id);
        }

        const guildData = this.client.setupConfig(guild);
        await guildData.save();

        const caseLogsExists = await this.client.db.caseLogs.exists({ _id: guild.id });
        if (caseLogsExists) {
            await this.client.db.caseLogs.findByIdAndDelete(guild.id);
        }

        const caseLogs = this.client.setupCaseLogs(guild);
        await caseLogs.save();
    }
};