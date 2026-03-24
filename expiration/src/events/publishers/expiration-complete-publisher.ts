import { ExpirationCompletedEvent, Publisher, Subjects } from "@dj_ticketing/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompletedEvent> {
    subject: Subjects.ExpirationCompleted = Subjects.ExpirationCompleted;
}