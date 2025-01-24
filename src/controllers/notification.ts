import { Request, Response } from 'express';
import { DatabaseService } from '../database/database-service';
import { Notification } from '../interfaces/notification';
import EventService from '../event/event-service';

export class NotificationsController {
    constructor(private db: DatabaseService, private events: EventService) {
        this.createNotification = this.createNotification.bind(this);
        this.getUserNotifications = this.getUserNotifications.bind(this);
    }
    // POST: Créer une notification
    async createNotification(req: Request, res: Response): Promise<void> {
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

    // GET: Récupérer les notifications d'un utilisateur
    async getUserNotifications(req: Request, res: Response): Promise<void> {
        try {
        const { userId } = req.params;

        if (!userId) {
            res.status(400).json({ error: 'userId is required.' });
            return;
        }

        const notifications = await this.db.getUserNotifications(userId);

        if (notifications.length === 0) {
            res.status(404).json({ error: 'No notifications found for this user.' });
            return;
        }

        res.status(200).json(notifications);
        } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Internal server error.' });
        }
    }
}