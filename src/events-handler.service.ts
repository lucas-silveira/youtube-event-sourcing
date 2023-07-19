import * as N from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PaymentEvent, PaymentEventsStream } from './models/events';

@N.Injectable()
export class EventsHandlerService {
  constructor(private readonly paymentEventsStream: PaymentEventsStream) {}

  @OnEvent('payment.*')
  public async handlePaymentEvents(event: PaymentEvent): Promise<void> {
    console.log(event, 'Event received');
    await this.paymentEventsStream.append(event);
  }
}
