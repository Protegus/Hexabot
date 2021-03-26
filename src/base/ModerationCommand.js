const Command = require('./Command');

class ModerationCommand extends Command {
    constructor (client, options) {
        super(client, options);
    }

    async logCase (caseLogs, caseObj) {
        const caseNum = caseLogs.moderations.length + 1;
        await this.client.db.caseLogs.findByIdAndUpdate(caseLogs._id, { $push: {
            moderations: {
                caseNumber: caseNum,
                moderationType: caseObj.moderationType,
                moderator: caseObj.moderator,
                target: caseObj.target,
                reason: caseObj.reason,
                date: new Date()
            }
        }});
    }

    async run (message, args) {
        // Ensure caseLogs db exists for the guild
        let caseLogs = await this.client.db.caseLogs.findById(message.guildID);
        if (!caseLogs) {
            caseLogs = await this.client.setupCaseLogs(message.guild);
        }

        await caseLogs.save();

        //Now that we've verified that it exists, run the actual command.
        message.caseLogs = caseLogs;
        this.execute(message, args);
    }
}

module.exports = ModerationCommand;