import { CustomTransportStrategy, Server } from '@nestjs/microservices';
import * as mongoose from 'mongoose';
import { ChangeStream, ChangeStreamInsertDocument } from 'mongodb';
import * as path from 'path';
import * as fs from 'fs/promises';
import { Events, ReadModel } from './models';

export class ETLWorker extends Server implements CustomTransportStrategy {
  private RESUME_TOKEN_FILE_PATH = path.resolve('./etl-resume-token.json');
  private conn: mongoose.Connection;
  private changeStream: ChangeStream<
    Events.PaymentEvent,
    ChangeStreamInsertDocument<Events.PaymentEvent>
  >;
  private resumeToken: object;

  public async listen(callback: () => void): Promise<void> {
    callback();
    try {
      this.conn = (
        await mongoose.connect('mongodb://root:secure@localhost/eventsourcing')
      ).connection;

      await this.watchChanges();

      await this.conn.close();
    } catch (err) {
      console.dir(err);
      await this.sleep(5000);
      return this.listen(callback);
    }
  }

  public async close(): Promise<void> {
    await this.changeStream.close();
    await this.conn.close();
  }

  private sleep(ms = 1000): Promise<void> {
    return new Promise((res) => setTimeout(res, ms));
  }

  private async watchChanges(): Promise<void> {
    const paymentsStoreColl =
      this.conn.collection<Events.PaymentEvent>('payments-store');
    const paymentDetailsColl =
      this.conn.collection<ReadModel.PaymentDetails>('payments-details');
    const customersColl = this.conn.collection<{ _id: number; name: string }>(
      'customers',
    );

    this.resumeToken = await this.getToken();
    this.changeStream = paymentsStoreColl.watch(
      [{ $match: { operationType: 'insert' } }],
      { startAfter: this.resumeToken },
    );

    for await (const change of this.changeStream) {
      console.log(change, 'Change received');
      this.resumeToken = change._id as object;
      const event = change.fullDocument;

      const customer = await customersColl.findOne({ _id: event.customerId });

      await paymentDetailsColl.updateOne(
        { _id: event.orderId },
        [
          {
            $replaceRoot: {
              newRoot: {
                $mergeObjects: [
                  '$$ROOT',
                  {
                    status: {
                      $ifNull: [event.data.status, '$status', null],
                    },
                    customerId: {
                      $ifNull: ['$customerId', event.customerId],
                    },
                    customerName: {
                      $ifNull: ['$customerName', customer.name],
                    },
                    amount: {
                      $ifNull: ['$amount', event.data.amount],
                    },
                    paidAmount: {
                      $ifNull: ['$paidAmount', event.data.paidAmount],
                    },
                    cardToken: {
                      $ifNull: ['$cardToken', event.data.cardToken],
                    },
                    createdAt: {
                      $ifNull: ['$createdAt', event.timestamp],
                    },
                    updatedAt: event.timestamp,
                  },
                ],
              },
            },
          },
        ],
        {
          upsert: true,
        },
      );
      await this.saveToken(this.resumeToken);
    }
    await this.changeStream.close();
  }

  private async saveToken(token: object): Promise<void> {
    await fs.writeFile(this.RESUME_TOKEN_FILE_PATH, JSON.stringify(token));
  }

  private async getToken(): Promise<object> {
    try {
      const serializedData = await fs.readFile(this.RESUME_TOKEN_FILE_PATH, {
        encoding: 'utf-8',
      });
      return JSON.parse(serializedData);
    } catch (err) {
      console.dir(err);
      return undefined;
    }
  }
}
