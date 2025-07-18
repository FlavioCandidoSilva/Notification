import { Module, Provider, Scope } from '@nestjs/common';
import { InfrastructureModule } from 'src/infrastructure/infraestructure.module';
import { INotificationService } from './notification/interface/notification.interface';
import { NotificationService } from './notification/services/notification.service';


const services: Provider[] = [
    {
      provide: INotificationService,
      useClass: NotificationService, 
    },
  ];
  
  @Module({
    imports: [InfrastructureModule],
    providers: [...services],
    exports: [
      InfrastructureModule,
      INotificationService
    ],
  })
export class DomainModule {}
  