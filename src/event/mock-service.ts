import EventService from "./event-service";

export default class EventMockService implements EventService {
    async sendEvent(event: object) {
        console.log("Sending event", event);
    }
}