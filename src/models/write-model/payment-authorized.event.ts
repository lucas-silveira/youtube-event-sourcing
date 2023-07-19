import { EventKey, PaymentEvent, PaymentEventArgs } from '../events';
import { PaymentStatus } from './payment-status.enum';

export type PaymentAuthorizedArgs = Omit<PaymentEventArgs, 'key' | 'data'>;
export class PaymentAuthorized extends PaymentEvent {
  constructor(args: PaymentAuthorizedArgs) {
    super({
      ...args,
      key: EventKey.PaymentAuthorized,
      data: { status: PaymentStatus.Authorized },
    });
  }
}
