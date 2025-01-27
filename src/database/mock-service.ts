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
        if(userId == "1") {
            return new Promise((resolve) => {
                const notifications: Notification[] = [
                    {
                        notificationId: "mock-id",
                        title: "Mock notification",
                        createdAt: new Date(),
                        userId: "1",
                        message: "Mock notification"
                    }
                ];
                resolve(notifications);
            });
        }else{
            return new Promise((resolve) => {
                resolve([]);
            });
        }
    }
}