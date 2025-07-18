import { CreateNotificationDto } from 'src/domain/notification/requests/notification.dto';

export abstract class INotificationAppService {
    abstract create(createNotificationDto: CreateNotificationDto): Promise<void>;
}
