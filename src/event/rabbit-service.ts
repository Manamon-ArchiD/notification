import { Channel } from "amqplib";
import EventService from "./event-service";

export default class RabbitService implements EventService {
    constructor(
        private channelName: string, 
        private channel: Channel
    ) {}

    async sendEvent(event: object) {
        const message = JSON.stringify(event);
        console.debug("Sending event", event);
        this.channel.sendToQueue(this.channelName, Buffer.from(message), {
            persistent: true, 
        });
    }
}