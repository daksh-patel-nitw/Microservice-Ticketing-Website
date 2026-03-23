import mongoose from 'mongoose';
import { OrderStatus } from '@dj_ticketing/common';
import { TicketDoc } from './ticket';
export { OrderStatus };

interface OrderAttrs {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;  
}

interface OrderDoc extends mongoose.Document {
  id:string;
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
  version:number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
      required: true
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket'
    }
  },
  {
    toJSON: {
      transform(doc, ret: any) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

OrderSchema.set('versionKey','version');
OrderSchema.set('optimisticConcurrency',true);

OrderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', OrderSchema);

export { Order };
