import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateNotificationDto } from 'src/domain/notification/requests/notification.dto';
import { INotificationService } from 'src/domain/notification/interface/notification.interface';
import { INotificationAppService } from '../interfaces/notification.app.services.interface';

@Injectable()
export class NotificationAppService implements INotificationAppService {
  constructor(
    private readonly notificationService: INotificationService,
    @Inject('RABBITMQ_SERVICE') private readonly rabbitClient: ClientProxy,
  ) {}

  async create(createNotificationDto: CreateNotificationDto): Promise<void> {
    this.notificationService.validateCreateNotification(createNotificationDto);

    await this.rabbitClient.emit('fila.notificacao.entrada.notification', {
      mensagemId: createNotificationDto.mensagemId,
      conteudoMensagem: createNotificationDto.conteudoMensagem,
    }).toPromise();
  }
}