import {Client, Message} from "discord.js";
import {inject, injectable} from "inversify";
import {TYPES} from "./types";
import {MessageResponder} from "./services/message-responder";

@injectable()
export class Bot {
  private client: Client;
  private readonly token: string;
  private messageResponder: MessageResponder;
  private prefix: string;

  constructor(
    @inject(TYPES.Client) client: Client,
    @inject(TYPES.Token) token: string,
    @inject(TYPES.CommandPrefix) prefix: string,
    @inject(TYPES.MessageResponder) messageResponder: MessageResponder) {
    this.client = client;
    this.token = token;
    this.prefix = prefix;
    this.messageResponder = messageResponder;
  }

  public listen(): Promise<string> {
    this.client.on('message', (message: Message) => {
      if (message.content.substring(0, this.prefix.length) !== this.prefix || message.author.bot){
        return;
      }

      message.content = message.content.substring(this.prefix.length);

      console.log("Command received! Contents: ", message.content);

      this.messageResponder.handle(message).then(() => {
        console.log("Response sent!");
      }).catch(() => {
        console.log("Response not sent.")
      })
    });

    return this.client.login(this.token);
  }
}