import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from '@rn-test-tickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
