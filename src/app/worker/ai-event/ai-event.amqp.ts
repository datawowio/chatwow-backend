import { Injectable } from '@nestjs/common';

import { BaseAmqpHandler } from '@infra/global/amqp/amqp.abstract';

@Injectable()
export class AiEventAmqp extends BaseAmqpHandler {}
