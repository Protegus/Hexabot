import Eris from 'eris';
import Pluris from 'pluris';
import Signale from 'signale';

import Config from '../config.json';

Pluris(Eris);

class Hexabot extends Eris.Client {
    public logger: Signale.Signale;

    public commands: Map<string, object>;
    public aliases: Map<string, string>;

    public config: object;

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

const Client = new Hexabot(Config.token);

Client.on('ready', () => Signale.success("Ready!"));

Client.on('messageCreate', async (msg) => {
    if (msg.content === "?ping") {
        await Client.wait(1000);

        Client.createMessage(msg.channel.id, "I've waited 1 second!");
    }
});

Client.connect();