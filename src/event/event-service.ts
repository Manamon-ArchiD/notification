export default interface EventService {
    sendEvent(event: object): Promise<void>;
}