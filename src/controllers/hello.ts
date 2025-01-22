import { Request, Response } from 'express';
import { DatabaseService } from '../database/database-service';

export default class HelloController {
    constructor(private db: DatabaseService) {}

    handle(req: Request, res: Response) {
        res.end('Hello World');
    }
}