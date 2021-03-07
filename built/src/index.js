"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const eris_1 = __importDefault(require("eris"));
const pluris_1 = __importDefault(require("pluris"));
const signale_1 = __importDefault(require("signale"));
const config_json_1 = __importDefault(require("../config.json"));
pluris_1.default(eris_1.default);
class Hexabot extends eris_1.default.Client {
    constructor(token, options) {
        super(token, options);
        this.logger = signale_1.default;
        this.commands = new Map();
        this.aliases = new Map();
        this.config = config_json_1.default;
    }
    wait(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }
}
const Client = new Hexabot(config_json_1.default.token);
Client.on('ready', () => signale_1.default.success("Ready!"));
Client.on('messageCreate', (msg) => __awaiter(void 0, void 0, void 0, function* () {
    if (msg.content === "?ping") {
        yield Client.wait(1000);
        msg.channel.createMessage("I waited 1 second!");
    }
}));
Client.connect();
