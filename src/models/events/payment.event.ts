import * as M from '@nestjs/mongoose';
import { PaymentStatus } from '../write-model';
import { Model } from 'mongoose';
import { EventKey } from './event-key.enum';

export type PaymentEventArgs = {
  key: EventKey;
  isSnapshot?: boolean;
  orderId: string;
  customerId: number;
  data: PaymentData;
  timestamp?: Date;
  version?: number;
};
@M.Schema({ _id: false })
export class PaymentData {
  @M.Prop({
    type: String,
    enum: PaymentStatus,
    immutable: true,
  })
  public status?: PaymentStatus;

  @M.Prop({ type: Number, immutable: true })
  public amount?: number;

  @M.Prop({ type: Number, immutable: true })
  public paidAmount?: number;

  @M.Prop({ type: String, immutable: true })
  public cardToken?: string;
}
const PaymentDataSchema = M.SchemaFactory.createForClass(PaymentData);

@M.Schema({
  collection: 'payments-store',
})
export class PaymentEvent {
  @M.Prop({
    type: String,
    enum: EventKey,
    required: true,
    immutable: true,
  })
  public key: EventKey;

  @M.Prop({ type: Boolean, required: true, immutable: true })
  public isSnapshot = false;

  @M.Prop({ type: String, required: true, immutable: true })
  public orderId: string;

  @M.Prop({ type: Number, required: true, immutable: true })
  public customerId: number;

  @M.Prop({ type: PaymentDataSchema, required: true, immutable: true })
  public data: PaymentData;

  @M.Prop({ type: Date, required: true, immutable: true })
  public timestamp = new Date();

  @M.Prop({ type: Number, required: true, immutable: true })
  public version = 0;

  constructor(args?: PaymentEventArgs) {
    Object.assign(this, { ...args, version: args.version ?? 0 });
    this.version += 1;
  }
}

export type PaymentEventAR = Model<PaymentEvent>;
export const PaymentEventSchema = M.SchemaFactory.createForClass(PaymentEvent)
  .index({ orderId: 1, isSnapshot: 1, timestamp: -1 })
  .index({ customerId: 1, isSnapshot: 1, timestamp: -1 });
