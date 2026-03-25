import { PaymentCreatedEvent, Publisher, Subjects } from "@dj_ticketing/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
    subject: Subjects.PaymentCreated=Subjects.PaymentCreated;
}