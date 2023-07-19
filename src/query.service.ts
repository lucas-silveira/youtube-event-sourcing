import * as N from '@nestjs/common';
import { ReadModel } from './models';
import { GetAllPaymentDetailsQuery, GetPaymentDetailsQuery } from './queries';

@N.Injectable()
export class QueryService {
  constructor(
    private readonly PaymentDetailsDAO: ReadModel.PaymentDetailsDAO,
  ) {}

  public async fetchPaymentById(
    query: GetPaymentDetailsQuery,
  ): Promise<ReadModel.PaymentDetails> {
    const PaymentDetails = await this.PaymentDetailsDAO.fetchOneById(query.id);

    if (!PaymentDetails)
      throw new N.NotFoundException(
        `The payment details ${query.id} was not found`,
      );

    return PaymentDetails;
  }

  public fetchAllPaymentsByCID(
    query: GetAllPaymentDetailsQuery,
  ): Promise<ReadModel.PaymentDetails[]> {
    return this.PaymentDetailsDAO.fetchAllByCID(
      query.customerId,
      query.skip,
      query.limit,
    );
  }
}
