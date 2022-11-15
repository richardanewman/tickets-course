import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { DatabaseConnectionError } from '../errors/database-connection-error';
import { RequestValidatorError } from '../errors/request-validation-error';

const router = express.Router();

router.post(
  '/api/users/sign-up',
  [
    body('email').isEmail().withMessage('Email must be valid.'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters.'),
  ],
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidatorError(errors.array());
    }

    const { email, password } = req.body;
    console.log('Creating user.');
    throw new DatabaseConnectionError();
    res.send({});
  }
);

export { router as signUpRouter };
