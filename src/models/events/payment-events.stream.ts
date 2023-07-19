import * as N from '@nestjs/common';
import { PaymentEvent, PaymentEventAR } from './payment.event';

@N.Injectable()
export class PaymentEventsStream {
  constructor(
    @N.Inject('PaymentEvent')
    private readonly PaymentEvent: PaymentEventAR,
  ) {}

  public async fetchLastSnapshot(orderId: string): Promise<PaymentEvent> {
    return this.PaymentEvent.findOne({ orderId, isSnapshot: true })
      .sort({
        timestamp: -1,
      })
      .lean();
  }

  public async generateSnapshot(orderId: string): Promise<PaymentEvent> {
    const events = await this.runPipeline(orderId);
    return events?.at(0);
  }

  public async generateSnapshotAfter(
    orderId: string,
    version: number,
  ): Promise<PaymentEvent> {
    const events = await this.runPipeline(orderId, version);
    return events?.at(0);
  }

  public async append(event: PaymentEvent): Promise<void> {
    const shouldBeSnapshot = event.version % 3 === 0;

    if (shouldBeSnapshot) {
      const lastSnapshot = await this.fetchLastSnapshot(event.orderId);
      const newSnapshot = await this.generateSnapshotAfter(
        event.orderId,
        lastSnapshot?.version,
      );
      this.merge(newSnapshot, event);
    }

    await this.PaymentEvent.create(event);
  }

  private runPipeline(
    orderId: string,
    version?: number,
  ): Promise<PaymentEvent[]> {
    return this.PaymentEvent.aggregate<PaymentEvent>([
      {
        $match: {
          orderId,
          ...(version && { version: { $gte: version } }),
        },
      },
      {
        $sort: {
          timestamp: 1,
        },
      },
      {
        $group: {
          _id: '$orderId',
          key: {
            $first: '$key',
          },
          orderId: {
            $first: '$orderId',
          },
          customerId: {
            $first: '$customerId',
          },
          data: {
            $mergeObjects: '$data',
          },
          version: {
            $last: '$version',
          },
          createdAt: {
            $first: '$timestamp',
          },
          updatedAt: {
            $last: '$timestamp',
          },
        },
      },
      {
        $unset: '_id',
      },
    ]).exec();
  }

  private merge(snapshot: PaymentEvent, event: PaymentEvent): void {
    Object.assign(event, {
      isSnapshot: true,
      data: { ...snapshot.data, ...event.data },
    });
  }
}
