import { Notification } from "../interfaces/notification";
import { DatabaseService } from "./database-service";

export class MockService implements DatabaseService {
    createNotification(notification: Omit<Notification, "notificationId" | "createdAt">): Promise<Notification> {
        throw new Error("Method not implemented.");
    }   

    getUserNotifications(userId: string): Promise<Notification[]> {
        throw new Error("Method not implemented.");
    }
}