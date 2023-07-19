import * as N from '@nestjs/common';
import { ReadModel } from './models';
import { CommandService } from './command.service';
import { QueryService } from './query.service';
import { CreatePaymentCommand, PayPaymentCommand } from './commands';

@N.Controller()
export class AppController {
  constructor(
    private readonly commandService: CommandService,
    private readonly queryService: QueryService,
  ) {}

  @N.Post('payments')
  public createPayment(@N.Body() command: CreatePaymentCommand): Promise<void> {
    return this.commandService.createPayment(command);
  }

  @N.Post('payments/:id/authorize')
  public authorizePayment(@N.Param('id') id: string): Promise<void> {
    return this.commandService.authorizePayment({ id });
  }

  @N.Post('payments/:id/approve-analysis')
  public approvePaymentAnalysis(@N.Param('id') id: string): Promise<void> {
    return this.commandService.approvePaymentAnalysis({ id });
  }

  @N.Post('payments/:id/pay')
  public payPayment(
    @N.Param('id') id: string,
    @N.Body() command: Omit<PayPaymentCommand, 'id'>,
  ): Promise<void> {
    return this.commandService.payPayment({ id, ...command });
  }

  @N.Get('payments-details/:id')
  public getPaymentDetails(
    @N.Param('id') id: string,
  ): Promise<ReadModel.PaymentDetails> {
    return this.queryService.fetchPaymentById({ id });
  }

  @N.Get('payments-details')
  public getAllPaymentDetails(
    @N.Query('customerId', N.ParseIntPipe) customerId: number,
    @N.Query('skip', new N.DefaultValuePipe(0), N.ParseIntPipe) skip: number,
    @N.Query('limit', new N.DefaultValuePipe(10), N.ParseIntPipe) limit: number,
  ): Promise<ReadModel.PaymentDetails[]> {
    return this.queryService.fetchAllPaymentsByCID({
      customerId,
      skip,
      limit,
    });
  }
}
