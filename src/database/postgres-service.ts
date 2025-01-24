import { Notification } from './../interfaces/notification';
import { Client } from "ts-postgres";
import { DatabaseService } from "./database-service";

export class PostgresService implements DatabaseService {
    constructor(private database: Client) {}

    // Créer une notification
    async createNotification(notification: Omit<Notification, 'notificationId' | 'createdAt'>): Promise<Notification> {
        const { userId, title, message } = notification;
        const query = `
        INSERT INTO notifications (user_id, title, message, created_at)
        VALUES ($1, $2, $3, NOW())
        RETURNING 
            id,
            user_id, 
            title, 
            message, 
            created_at;
        `;
    
        const result = await this.database.query(query, [userId, title, message]);
        const row = result.rows[0];
        return {
            notificationId: row.get('id'),
            userId: row.get('user_id'),
            title: row.get('title'),
            message: row.get('message'),
            createdAt: row.get('created_at')
        } as Notification;
    }
}