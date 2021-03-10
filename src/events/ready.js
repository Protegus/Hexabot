module.exports = class {
    constructor (client) {
        this.client = client;
    }

    async run () {

        this.client.logger.success('I am ready!');
    }
};