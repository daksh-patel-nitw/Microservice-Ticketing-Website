import mongoose from "mongoose";
import { natsWrapper } from "../../../nats-wrapper";
import { ExpirationCompletedEvent, OrderStatus } from "@dj_ticketing/common";
import { Message } from 'node-nats-streaming';
import { Ticket } from "../../../models/ticket";
import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { Order } from "../../../models/order";

const setup = async () => {
    const listener = new ExpirationCompleteListener(natsWrapper.client);

    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'Bhajan',
        price: 10,
    })
    await ticket.save();

    const order = Order.build({
        userId: 'dssdsdf',
        status: OrderStatus.Created,
        ticket,
        expiresAt: new Date()
    })

    const data: ExpirationCompletedEvent['data'] = {
        orderId: order.id
    }

    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, order, ticket, data, msg };
}


it('Updates the order status to cancelled', async () => {
    const { listener, data, msg, ticket, order } = await setup();

    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
})

it('acks the message', async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
})

it('emit an OrderCancelled event', async () => {
    const { listener, data, msg, order } = await setup();

    await listener.onMessage(data, msg);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
    const eventData = JSON.parse(
        (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
    );
    expect(eventData.id).toEqual(order.id);
})