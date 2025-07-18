import { CreateNotificationDto } from "../requests/notification.dto";

export abstract class INotificationService {
  abstract validateCreateNotification(dto: CreateNotificationDto): Promise<string>;
} 