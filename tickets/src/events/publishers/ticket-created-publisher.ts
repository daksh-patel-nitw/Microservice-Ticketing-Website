import { Publisher, Subjects, TicketCreatedEvent } from '@dj_ticketing/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
