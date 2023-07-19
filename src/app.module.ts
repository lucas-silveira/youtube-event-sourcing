import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Events, WriteModel, ReadModel } from './models';
import { CommandService } from './command.service';
import { QueryService } from './query.service';
import { EventsHandlerService } from './events-handler.service';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://root:secure@localhost/eventsourcing'),
    MongooseModule.forFeature([
      {
        name: Events.PaymentEvent.name,
        schema: Events.PaymentEventSchema,
      },
      {
        name: ReadModel.PaymentDetails.name,
        schema: ReadModel.PaymentDetailsSchema,
      },
    ]),
    EventEmitterModule.forRoot({ wildcard: true }),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: 'PaymentEvent',
      useFactory: (model) => model,
      inject: [getModelToken(Events.PaymentEvent.name)],
    },
    {
      provide: 'PaymentDetails',
      useFactory: (model) => model,
      inject: [getModelToken(ReadModel.PaymentDetails.name)],
    },
    Events.PaymentEventsStream,
    ReadModel.PaymentDetailsDAO,
    WriteModel.PaymentsRepository,
    CommandService,
    QueryService,
    EventsHandlerService,
  ],
})
export class AppModule {}
