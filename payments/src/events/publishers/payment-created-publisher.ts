import {
  Subjects,
  Publisher,
  PaymentCreatedEvent,
} from '@rn-test-tickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
