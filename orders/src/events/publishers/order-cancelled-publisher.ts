import { Publisher, Subjects, OrderCancelledEvent } from '@dj_ticketing/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
