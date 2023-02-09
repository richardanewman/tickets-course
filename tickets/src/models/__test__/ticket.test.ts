import { Ticket } from '../ticket';

it('implements optimistic concurrency control', async () => {
  //Create an instance of a ticket
  const ticket = Ticket.build({
    title: 'raffle ticket',
    price: 5,
    userId: '123',
  });
  //Save the ticket
  await ticket.save();
  //Fetch ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);
  //Make two separate changes to the ticket
  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });

  //Save the first fetched ticket
  await firstInstance!.save();
  //Save the second fectched ticket and expect an error
  expect(async () => await secondInstance!.save()).rejects.toThrow();
});

it('increments the version number on multiple saves', async () => {
  const ticket = Ticket.build({
    title: 'movie',
    price: 20,
    userId: '123',
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});
