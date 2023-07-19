import { EventEmitter2 } from '@nestjs/event-emitter';
import * as crypto from 'crypto';
import { PaymentEvent } from '../events';
import { PaymentAuthorized } from './payment-authorized.event';
import { PaymentCreated } from './payment-created.event';
import { PaymentStatus } from './payment-status.enum';
import { PaymentFraudAnalysisApproved } from './payment-fraud-analysis-approved.event';
import { PaymentPaid } from './payment-paid.event';

type PaymentArgs = {
  customerId: number;
  amount: number;
  cardToken: string;
};
export class Payment {
  public id: string;
  public customerId: number;
  public status: PaymentStatus;
  public amount: number;
  public paidAmount: number;
  public cardToken: string;
  public version = 0;
  public updatedAt: Date;
  public createdAt: Date;

  public static eventEmitter: EventEmitter2;

  constructor(args?: PaymentArgs) {
    if (args)
      this.applyEvents([
        new PaymentCreated({
          orderId: crypto.randomUUID(),
          customerId: args.customerId,
          data: {
            amount: args.amount,
            cardToken: args.cardToken,
          },
        }),
      ]);
  }

  public authorize(): void {
    this.applyEvents([
      new PaymentAuthorized({
        orderId: this.id,
        customerId: this.customerId,
        version: this.version,
      }),
    ]);
  }

  public approveFraudAnalysis(): void {
    this.applyEvents([
      new PaymentFraudAnalysisApproved({
        orderId: this.id,
        customerId: this.customerId,
        version: this.version,
      }),
    ]);
  }

  public pay(amount: number): void {
    this.applyEvents([
      new PaymentPaid({
        orderId: this.id,
        customerId: this.customerId,
        version: this.version,
        data: {
          paidAmount: amount,
        },
      }),
    ]);
  }

  public applyEvents(events: PaymentEvent[]): this {
    events.forEach((e) => {
      this.merge(e);
      Payment.eventEmitter.emit(e.key, e);
    });
    return this;
  }

  public replayEvents(events: PaymentEvent[]): this {
    events.forEach((e) => {
      this.merge(e);
    });
    return this;
  }

  private merge(event: PaymentEvent): void {
    const { orderId: id, data, ...root } = event;
    Object.assign(this, { id, ...data, ...root });
  }
}
