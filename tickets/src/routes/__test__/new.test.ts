import request from 'supertest';
import { app } from '../../app';
import { signIn } from '../../test/test-util';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('has a route handler listening on /api/tickets', async () => {
  const response = await request(app).post('/api/tickets').send({});

  expect(response.status).not.toEqual(404);
});

it('can only be accessed if user in signed in', async () => {
  await request(app).post('/api/tickets').send({}).expect(401);
});

it('returns status other than 401 if user is signed in', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', signIn())
    .send({});

  expect(response.status).not.toEqual(401);
});

it('returns an error if title is invalid', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', signIn())
    .send({
      title: '',
      price: 10,
    })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', signIn())
    .send({
      price: 10,
    })
    .expect(400);
});

it('returns an error if price is invalid', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', signIn())
    .send({
      title: 'test title',
      price: -10,
    })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', signIn())
    .send({
      title: 'test title',
    })
    .expect(400);
});

it('creates a ticket with valid inputs', async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  const title = 'test';
  const price = 10;
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', signIn())
    .send({
      title,
      price,
    })
    .expect(201);

  const ticket = await Ticket.findById(response.body.id);
  expect(ticket?.title).toEqual(title);
  expect(ticket?.price).toEqual(price);
});

it('publishes an event', async () => {
  const title = 'test';
  const price = 10;
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', signIn())
    .send({
      title,
      price,
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
