import mongoose from "mongoose";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener"
import { OrderCreatedEvent, OrderStatus } from "@dj_ticketing/common";
import { Message } from 'node-nats-streaming';
import { Ticket } from "../../../models/ticket";

const setup = async () => {
    //create an instance of the Listener
    const listener = new OrderCreatedListener(natsWrapper.client);

    // create and save ticket
    const ticket = Ticket.build({
        title: 'Bhajan',
        price: 500,
        userId: 'asd'
    })
    await ticket.save()

    //create fake data 
    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        userId: 'demo',
        expiresAt: 'demo',
        version: 0,
        ticket: {
            id: ticket.id,
            price: ticket.price
        }
    }

    // create a fake message object
    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, msg, ticket };
}

it('sets the userId of the ticket', async () => {
    const { listener, data, msg, ticket } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.orderId).toEqual(data.id);
})

it('acks the message', async () => {
    const { listener, data, msg } = await setup();
    
    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
})

it('publishes a ticket updated event',async()=>{
    const { listener, data, msg, ticket } = await setup();

    await listener.onMessage(data,msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const ticketUpdatedData=JSON.parse(
        (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
    )

    expect(data.id).toEqual(ticketUpdatedData.orderId);
    
})