import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on successful signup', async () => {
  await request(app)
    .post('/api/users/sign-up')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);
});

it('returns a 400 with an invalid email', async () => {
  await request(app)
    .post('/api/users/sign-up')
    .send({
      email: 'test',
      password: 'password',
    })
    .expect(400);
});

it('returns a 400 with an invalid password', async () => {
  await request(app)
    .post('/api/users/sign-up')
    .send({
      email: 'test@test.com',
      password: 'p',
    })
    .expect(400);
});

it('returns a 400 with a email and password', async () => {
  await request(app).post('/api/users/sign-up').send({}).expect(400);
});

it('do not allow duplicate account signup', async () => {
  await request(app)
    .post('/api/users/sign-up')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  await request(app)
    .post('/api/users/sign-up')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(400);
});

it('sets a cookie after successful sign-up', async () => {
  const response = await request(app)
    .post('/api/users/sign-up')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined();
});
