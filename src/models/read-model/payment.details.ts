import * as M from '@nestjs/mongoose';
import { PaymentStatus } from '../write-model/payment-status.enum';
import { Model } from 'mongoose';

@M.Schema({
  collection: 'payments-details',
})
export class PaymentDetails {
  @M.Prop({ type: String })
  public readonly _id: string;

  @M.Prop({ type: Number, index: 1 })
  public readonly customerId: number;

  @M.Prop({ type: String })
  public readonly customerName: string;

  @M.Prop({ type: String })
  public readonly status: PaymentStatus;

  @M.Prop({ type: Number })
  public readonly amount: number;

  @M.Prop({ type: String })
  public readonly cardToken: string;

  @M.Prop({ type: Number })
  public readonly paidAmount: number;

  @M.Prop({ type: Date })
  public readonly createdAt: Date;

  @M.Prop({ type: Date })
  public readonly updatedAt: Date;
}

export type PaymentDetailsAR = Model<PaymentDetails>;
export const PaymentDetailsSchema =
  M.SchemaFactory.createForClass(PaymentDetails);
