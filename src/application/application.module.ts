import { Module, Provider } from '@nestjs/common';
import { createMapper } from './shared/mapper/createMapper';
import { DomainModule } from 'src/domain/domain.module';
import { NotificationAppService } from './notification/services/notification.app.service';
import { INotificationAppService } from './notification/interfaces/notification.app.services.interface';
import { NotificationConsumerService } from './notification/services/notification-consumer.service';
import { NotificationStatusService } from './notification/services/notification-status.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

const services: Provider[] = [
  {
    provide: INotificationAppService,
    useClass: NotificationAppService,
  }
];

const profiles = [];

@Module({
  imports: [
    DomainModule,
    ClientsModule.register([
      {
        name: 'RABBITMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://admin:admin@localhost:5672'],
          queue: 'fila.notificacao.entrada.notification',  
          queueOptions: { durable: true },
        },
      },
    ]),
  ],
  providers: [
    {
      provide: 'Mapper',
      useFactory: () => {
        const mapper = createMapper();
        mapper.register(profiles);
        return mapper;
      },
    },
    ...services,
    NotificationConsumerService,
    NotificationStatusService,
  ],
  exports: [
    'Mapper',
    INotificationAppService,
    NotificationStatusService,
  ],
})
export class ApplicationModule { }