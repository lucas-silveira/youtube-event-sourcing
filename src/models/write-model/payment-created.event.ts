import { EventKey, PaymentEvent, PaymentEventArgs } from '../events';
import { PaymentStatus } from './payment-status.enum';

export type PaymentCreatedArgs = Omit<PaymentEventArgs, 'key'>;
export class PaymentCreated extends PaymentEvent {
  constructor(args: PaymentCreatedArgs) {
    super({
      ...args,
      key: EventKey.PaymentCreated,
      data: { ...args.data, status: PaymentStatus.Pending },
    });
  }
}
