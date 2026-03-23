import { Publisher, Subjects, OrderCreatedEvent } from '@dj_ticketing/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}