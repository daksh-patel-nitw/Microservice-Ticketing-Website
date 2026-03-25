import { Listener, Subjects, TicketUpdatedEvent } from "@dj_ticketing/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;

    queueGroupName = queueGroupName;

    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
        const updatedTicket = await Ticket.findOneAndUpdate(
            {
                _id: data.id,
                version: data.version - 1,
            },
            {
                $set: {
                    title: data.title,
                    price: data.price,
                    version:data.version
                },
            },
            { returnDocument: 'after' }
        );

        if (!updatedTicket) {
            throw new Error('Ticket not found');
        }

        msg.ack();
    }
}