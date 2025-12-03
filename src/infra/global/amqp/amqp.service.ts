import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Channel, ChannelModel, ConsumeMessage } from 'amqplib';

import { ExchangeConfig } from '@app/worker/worker.constant';

import myDayjs from '@shared/common/common.dayjs';

import { AMQP_CLIENT } from './amqp.provider';

@Injectable()
export class AmqpService implements OnModuleInit, OnModuleDestroy {
  _channel: Channel;

  constructor(
    @Inject(AMQP_CLIENT)
    private connection: ChannelModel,
  ) {}

  async onModuleInit() {
    this._channel = await this.connection.createChannel();
  }

  async onModuleDestroy() {
    if (this._channel) {
      await this._channel.close();
    }

    await this.connection.close();
  }

  publishMessage(exchange: string, queueName: string, payload?: any) {
    this.channel.publish(
      exchange,
      `${exchange}.${queueName}.main`,
      Buffer.from(JSON.stringify(payload)),
      { persistent: true },
    );
  }

  async setupQueues(configs: Record<string, ExchangeConfig>) {
    for (const config of Object.values(configs)) {
      const exchangeName = config.name;

      // Exchange
      await this.channel.assertExchange(exchangeName, 'direct', {
        durable: true,
      });

      for (const queue of config.queues) {
        const mainQueueName = `${exchangeName}.${queue}.main`;
        const retryQueueName = `${exchangeName}.${queue}.retry`;

        await this.channel.assertQueue(mainQueueName, {
          durable: true,
          deadLetterExchange: exchangeName,
          deadLetterRoutingKey: retryQueueName,
        });

        await this.channel.bindQueue(
          mainQueueName,
          exchangeName,
          mainQueueName,
        );

        const messageTtl = myDayjs.duration({ minutes: 1 }).asMilliseconds();
        await this.channel.assertQueue(retryQueueName, {
          durable: true,
          messageTtl,
          deadLetterExchange: exchangeName,
          deadLetterRoutingKey: mainQueueName,
        });

        await this.channel.bindQueue(
          retryQueueName,
          exchangeName,
          retryQueueName,
        );
      }
    }
  }

  async handleSuccess(msg: ConsumeMessage) {
    this.channel.ack(msg);
  }

  async handleFail(msg: ConsumeMessage) {
    this.channel.nack(msg, false, false);
  }

  async handleDead(msg: ConsumeMessage) {
    // log before ack

    this.channel.ack(msg);
  }

  get channel() {
    return this._channel;
  }
}
