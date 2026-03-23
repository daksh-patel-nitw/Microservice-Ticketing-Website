import mongoose from "mongoose";
import { natsWrapper } from "../../../nats-wrapper";
import { Message } from 'node-nats-streaming';
import { Ticket } from "../../../models/ticket";
import { OrderCancelledEvent, OrderStatus } from "@dj_ticketing/common";
import { OrderCancelledListener } from "../order-cancelled-listener";

const setup = async () => {
    //create an instance of the Listener
    const listener = new OrderCancelledListener(natsWrapper.client);

    // create and save ticket
    const orderId = new mongoose.Types.ObjectId().toHexString();

    const ticket = Ticket.build({
        title: 'Bhajan',
        price: 500,
        userId: 'asd'
    });
    ticket.set({ orderId });
    await ticket.save()

    //create fake data 
    const data: OrderCancelledEvent['data'] = {
        id: orderId,
        version: 0,
        ticket: {
            id: ticket.id
        }
    }

    // create a fake message object
    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, msg, ticket, orderId };
}

it('updates the ticket, publishes an event, and acks the message', async () => {
    const { listener, data, msg, ticket, orderId } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket!.orderId).not.toBeDefined();
    expect(msg.ack).toHaveBeenCalled();
    expect(natsWrapper.client.publish).toHaveBeenCalled();
})