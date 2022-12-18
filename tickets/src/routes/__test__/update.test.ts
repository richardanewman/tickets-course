import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { natsWrapper } from '../../nats-wrapper';
import { signIn } from '../../test/test-util';

it('returns 404 if id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', signIn())
    .send({
      title: 'test',
      price: 10,
    })
    .expect(404);
});

it('returns 401 if user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'test',
      price: 10,
    })
    .expect(401);
});

it('returns 401 is user does not own the ticket', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', signIn())
    .send({
      title: 'test',
      price: 10,
    });
  //signIn() will generate different user
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', signIn())
    .send({
      title: 'test new title',
      price: 20,
    })
    .expect(401);
});

it('returns 400 if user fails to provide title or price', async () => {
  const cookie = signIn();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'test',
      price: 10,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 20,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'test',
      price: undefined,
    })
    .expect(400);
});

it('updates ticket if valid inputs provided', async () => {
  const cookie = signIn();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'test',
      price: 10,
    });
  const title = 'updated title';
  const price = 30;
  const updateResponse = await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title,
      price,
    })
    .expect(200);

  expect(updateResponse.body.title).toEqual(title);
  expect(updateResponse.body.price).toEqual(price);
});

it('publishes an update event', async () => {
  const cookie = signIn();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'test',
      price: 10,
    });
  const title = 'updated title';
  const price = 30;
  const updateResponse = await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title,
      price,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
