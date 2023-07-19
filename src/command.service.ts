import * as N from '@nestjs/common';
import {
  ApprovePaymentAnalysisCommand,
  AuthorizePaymentCommand,
  CreatePaymentCommand,
  PayPaymentCommand,
} from './commands';
import { Payment, PaymentsRepository } from './models/write-model';

@N.Injectable()
export class CommandService {
  constructor(private readonly paymentsRepo: PaymentsRepository) {}

  public async createPayment(command: CreatePaymentCommand): Promise<void> {
    new Payment(command);
  }

  public async authorizePayment(
    command: AuthorizePaymentCommand,
  ): Promise<void> {
    const payment = await this.paymentsRepo.fetchOneById(command.id);
    if (!payment)
      throw new N.NotFoundException(`O payment ${command.id} was not found`);

    payment.authorize();
  }

  public async approvePaymentAnalysis(
    command: ApprovePaymentAnalysisCommand,
  ): Promise<void> {
    const payment = await this.paymentsRepo.fetchOneById(command.id);
    if (!payment)
      throw new N.NotFoundException(`O payment ${command.id} was not found`);

    payment.approveFraudAnalysis();
  }

  public async payPayment(command: PayPaymentCommand): Promise<void> {
    const payment = await this.paymentsRepo.fetchOneById(command.id);
    if (!payment)
      throw new N.NotFoundException(`O payment ${command.id} was not found`);

    payment.pay(command.amount);
  }
}
