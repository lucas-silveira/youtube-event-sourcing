export class CreatePaymentCommand {
  public readonly customerId: number;
  public readonly amount: number;
  public readonly cardToken: string;
}
