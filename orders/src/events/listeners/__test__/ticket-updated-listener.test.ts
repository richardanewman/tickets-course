import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { TicketUpdatedEvent } from '@rn-test-tickets/common';
import { TicketUpdatedListener } from '../ticket-updated-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  //create an instance of the listener
  const listener = new TicketUpdatedListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 10,
  });
  await ticket.save();
  //create a fake data event
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: 'new concert title',
    price: 222,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };
  //create a fake message object
  const msg: Partial<Message> = {
    ack: jest.fn(),
  };

  return { msg, data, ticket, listener };
};

it('finds, updates, and saves a ticket', async () => {
  const { msg, data, ticket, listener } = await setup();

  //call the onMessage function with the data object + message object
  await listener.onMessage(data, msg as Message);
  //write assertions to make sure a ticket was created
  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket).toBeDefined();
  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  //call the onMessage function with the data object + message object
  await listener.onMessage(data, msg as Message);

  //write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});

it('does NOT call ack if the event has a nonsequential version number', async () => {
  const { msg, data, ticket, listener } = await setup();

  data.version = 100;

  try {
    await listener.onMessage(data, msg as Message);
  } catch (err) {
    //this should throw an error and not ack msg
  }

  expect(msg.ack).not.toHaveBeenCalled();
});
