import { Module, Provider, Scope } from '@nestjs/common';
import { UnitOfWork } from './shared/unit-of-work';
import { IUnitOfWork } from 'src/domain/shared/unit-of-work.interface';

const services: Provider[] = [
  {
    provide: IUnitOfWork,
    scope: Scope.REQUEST,
    useFactory: () => {
      return new UnitOfWork();
    },
  },
];

@Module({
  providers: [...services],
  exports: [IUnitOfWork],
})
export class MySQLModule {}