import { Request, Response } from 'express';
import { DatabaseService } from '../database/database-service';
import { Notification } from '../interfaces/notification';
import EventService from '../event/event-service';

export class NotificationsController {
    constructor(private db: DatabaseService, private events: EventService) {
        this.createNotification = this.createNotification.bind(this);
    }

    async createNotification(req: Request, res: Response) {
        try {
            const { userId, title, message } = req.body;

            if (!userId || !title || !message) {
                res.status(400).json({ error: 'userId, title, and message are required.' });
                return;
            }

            const notification: Omit<Notification, 'notificationId' | 'createdAt'> = { userId, title, message };
            const createdNotification = await this.db.createNotification(notification);

            res.status(201).json(createdNotification);
        } catch (error) {
            console.error('Error creating notification:', error);
            res.status(500).json({ error: 'Internal server error.' });
        }
    }
}