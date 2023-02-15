import { Message } from 'node-nats-streaming';
import {
  Listener,
  OrderCancelledEvent,
  OrderStatus,
  Subjects,
} from '@rn-test-tickets/common';
import { QueueGroupNames } from '@rn-test-tickets/common';
import { Order } from '../../models/order';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = QueueGroupNames.PAYMENTS_SERVICE;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });

    if (!order) {
      throw new Error('Order not found.');
    }

    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    msg.ack();
  }
}
