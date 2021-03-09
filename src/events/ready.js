module.exports = class {
    constructor (client) {
        this.client = client;
    }

    async run () {
        this.client.wait(1000);

        this.client.logger.success('I am ready!');
    }
};