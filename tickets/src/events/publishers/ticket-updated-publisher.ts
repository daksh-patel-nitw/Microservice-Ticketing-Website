import { Publisher, Subjects, TicketUpdatedEvent } from '@dj_ticketing/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
