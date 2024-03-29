import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

export const signIn = (userId: string | undefined) => {
  const id = userId ?? new mongoose.Types.ObjectId().toHexString();
  const payload = {
    id: id,
    email: 'test@test.com',
  };

  const token = jwt.sign(payload, process.env.JWT_KEY!);
  const session = { jwt: token };
  const sessionJSON = JSON.stringify(session);
  const base64 = Buffer.from(sessionJSON).toString('base64');

  return [`session=${base64}`];
};
