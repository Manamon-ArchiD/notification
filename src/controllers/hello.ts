import { Request, Response } from 'express';
import { DatabaseService } from '../database/database-service';
import EventService from '../event/event-service';

export default class HelloController {
    constructor(private db: DatabaseService, private events: EventService) {
        this.handle = this.handle.bind(this);
    }

    handle(req: Request, res: Response) {
        res.end('Hello World');
        this.events.sendEvent({
            hello: "Hello world!"
        })
    }
}