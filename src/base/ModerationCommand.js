const Command = require('./Command');

class ModerationCommand extends Command {
    constructor (client, options) {
        super(client, options);
    }

    async logCase (guildData, caseObj) {
        const caseNum = guildData.moderations.length + 1;
        await this.client.db.findByIdAndUpdate(guildData._id, { $push: {
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
}

module.exports = ModerationCommand;