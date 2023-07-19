import * as N from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { WriteModel } from './models';

export const setupStaticMethods = (app: N.INestApplication): void => {
  WriteModel.Payment.eventEmitter = app.get<EventEmitter2>(EventEmitter2);
};
