import request from 'supertest';
import { app } from '../../app';
import { signIn } from '../../test/test-util';

const createTicket = () => {
  return request(app).post('/api/tickets').set('Cookie', signIn()).send({
    title: 'test',
    price: 10,
  });
};

it('returns all tickets', async () => {
  await createTicket();
  await createTicket();
  await createTicket();

  const response = await request(app).get('/api/tickets').send().expect(200);
  expect(response.body.length).toEqual(3);
});
