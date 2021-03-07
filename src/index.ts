import Eris from 'eris';
import Pluris from 'pluris';
import Signale from 'signale';

import fs from 'fs';

import Config from '../config.json';

Pluris(Eris);

class Hexabot extends Eris.Client {
    public logger: Signale.Signale;

    public commands: Map<string, File>;
    public aliases: Map<string, string>;

    public config: Record<string, string>;

    constructor (token: string, options?: Eris.ClientOptions) {
        super(token, options);

        this.logger = Signale;

        this.commands = new Map();
        this.aliases = new Map();

        this.config = Config;
    }

    wait (time: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, time));
    }
}

const client = new Hexabot(Config.token);

client.on('ready', () => client.logger.success("Ready!"));

client.on('messageCreate', async (msg) => {
    if (msg.content === "?ping") {
        msg.channel.createMessage("Waited 1 second! Pong!");
    }
});

client.connect();