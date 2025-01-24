import { Notification } from "../interfaces/notification";
import { DatabaseService } from "./database-service";

export class MockService implements DatabaseService {
    createNotification(notification: Omit<Notification, "notificationId" | "createdAt">): Promise<Notification> {
        return new Promise((resolve) => {
            const createdNotification: Notification = {
                notificationId: "mock-id",
                createdAt: new Date(),
                ...notification
            };
            resolve(createdNotification);
        });
    }   

    getUserNotifications(userId: string): Promise<Notification[]> {
        throw new Error("Method not implemented.");
    }
}