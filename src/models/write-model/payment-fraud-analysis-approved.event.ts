import { EventKey, PaymentEvent, PaymentEventArgs } from '../events';
import { PaymentStatus } from './payment-status.enum';

export type PaymentFraudAnalysisApprovedArgs = Omit<
  PaymentEventArgs,
  'key' | 'data'
>;
export class PaymentFraudAnalysisApproved extends PaymentEvent {
  constructor(args: PaymentFraudAnalysisApprovedArgs) {
    super({
      ...args,
      key: EventKey.PaymentFraudAnalysisApproved,
      data: { status: PaymentStatus.FraudAnalysisApproved },
    });
  }
}
