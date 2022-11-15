import express from 'express';

const router = express.Router();

router.get('/api/users/sign-in', (req, res) => {
  res.send('Hello sign-in!');
});

export { router as signInRouter };
