import { EventKey, PaymentEvent, PaymentEventArgs } from '../events';
import { PaymentStatus } from './payment-status.enum';

export type PaymentPaidArgs = Omit<PaymentEventArgs, 'key'>;
export class PaymentPaid extends PaymentEvent {
  constructor(args: PaymentPaidArgs) {
    super({
      ...args,
      key: EventKey.PaymentPaid,
      data: { ...args.data, status: PaymentStatus.Paid },
    });
  }
}
