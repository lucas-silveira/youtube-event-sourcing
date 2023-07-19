import * as N from '@nestjs/common';
import { PaymentEventsStream } from '../events';
import { Payment } from './payment.entity';

@N.Injectable()
export class PaymentsRepository {
  constructor(private readonly paymentEventsStream: PaymentEventsStream) {}

  public async fetchOneById(id: string): Promise<Payment> {
    const lastSnapshot = await this.paymentEventsStream.fetchLastSnapshot(id);
    const newSnapshot = await this.paymentEventsStream.generateSnapshot(id);
    const events = [];
    if (lastSnapshot) events.push(lastSnapshot);
    if (newSnapshot) events.push(newSnapshot);

    if (events.length > 0) return new Payment().replayEvents(events);
  }
}
