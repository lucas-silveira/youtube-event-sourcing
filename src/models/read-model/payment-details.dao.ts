import * as N from '@nestjs/common';
import { PaymentDetails, PaymentDetailsAR } from './payment.details';

@N.Injectable()
export class PaymentDetailsDAO {
  constructor(
    @N.Inject('PaymentDetails')
    private readonly PaymentDetails: PaymentDetailsAR,
  ) {}

  public fetchOneById(id: string): Promise<PaymentDetails> {
    return this.PaymentDetails.findById(id).lean();
  }

  public fetchAllByCID(
    customerId: number,
    skip = 0,
    limit = 10,
  ): Promise<PaymentDetails[]> {
    return this.PaymentDetails.find({ customerId }, {}, { skip, limit }).lean();
  }
}
