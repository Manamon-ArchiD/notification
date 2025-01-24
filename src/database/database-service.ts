import { Notification } from './../interfaces/notification';
export interface DatabaseService {

    createNotification(notification: Omit<Notification, 'notificationId' | 'createdAt'>): Promise<Notification>;
}