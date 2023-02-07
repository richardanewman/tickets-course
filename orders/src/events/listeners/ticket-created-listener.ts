import { Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  TicketCreatedEvent,
  QueueGroupNames,
} from '@rn-test-tickets/common';
import { Ticket } from '../../models/ticket';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = QueueGroupNames.ORDERS_SERVICE;

  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const { id, title, price } = data;
    const ticket = Ticket.build({
      id,
      title,
      price,
    });
    await ticket.save();

    msg.ack();
  }
}