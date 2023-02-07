import {
  Subjects,
  OrderCancelledEvent,
  Publisher,
} from '@rn-test-tickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
