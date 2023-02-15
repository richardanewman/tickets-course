import { Message } from 'node-nats-streaming';
import { Listener, OrderCreatedEvent, Subjects } from '@rn-test-tickets/common';
import { QueueGroupNames } from '@rn-test-tickets/common';
import { Order } from '../../models/order';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = QueueGroupNames.PAYMENTS_SERVICE;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const order = Order.build({
      id: data.id,
      price: data.ticket.price,
      status: data.status,
      userId: data.userId,
      version: data.version,
    });
    await order.save();
    msg.ack();
  }
}
