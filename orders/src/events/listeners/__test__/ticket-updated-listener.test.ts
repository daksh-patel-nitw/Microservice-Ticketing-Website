import mongoose from "mongoose";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedListener } from "../ticket-updated-listener"
import { TicketUpdatedEvent } from "@dj_ticketing/common";
import { Message } from 'node-nats-streaming';
import { Ticket } from "../../../models/ticket";

const setup = async () => {
    //create an instance of the Listener
    const listener = new TicketUpdatedListener(natsWrapper.client);

    //create and save a ticket
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'Bhajan',
        price: 10,
    })
    await ticket.save();

    // create a fake data event
    const data: TicketUpdatedEvent['data'] = {
        version: ticket.version + 1,
        id: ticket.id,
        title: 'Shiv Bhajan',
        price: 20,
        userId: new mongoose.Types.ObjectId().toHexString()
    }

    // create a fake message object
    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    //return all of stuff
    return { listener, data, msg, ticket };
}

it('finds, updates and saves ticket', async () => {
    const { listener, data, msg, ticket } = await setup();

    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // write assertions to make sure a ticket was created
    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
    expect(updatedTicket!.version).toEqual(data.version);
})

it('acks the message', async () => {
    const { listener, data, msg } = await setup();

    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // write assertions to make sure a ack is called
    expect(msg.ack).toHaveBeenCalled();
})

it('does not call ack when the event has a skipped version number',async()=>{
    const {msg,data,listener,ticket}=await setup();

    data.version=10;

    try{
        await listener.onMessage(data,msg);
    }catch(err){}
    
    expect(msg.ack).not.toHaveBeenCalled();
})