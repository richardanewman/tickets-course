import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from '@rn-test-tickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
