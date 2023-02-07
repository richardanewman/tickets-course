import {
  Publisher,
  OrderCreatedEvent,
  Subjects,
} from '@rn-test-tickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
