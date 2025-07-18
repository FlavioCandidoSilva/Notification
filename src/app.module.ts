import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { PresentationModule } from './presentation/presentation.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NotificationAppService } from './application/notification/services/notification.app.service';

@Module({
  imports: [
    PresentationModule,
    ConfigModule.forRoot({ isGlobal: true }),
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
})
export class AppModule {}
