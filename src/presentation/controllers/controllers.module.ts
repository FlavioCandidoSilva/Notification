import { Module } from '@nestjs/common';
import { ApplicationModule } from 'src/application/application.module';
import { JobsModule } from '../jobs/jobs.module';
import { NotificationController } from './notification.controller';

@Module({
  imports: [
    ApplicationModule,
    JobsModule
  ],
  controllers: [NotificationController],
})
export class ControllersModule {}
