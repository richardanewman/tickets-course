import express, { Request, Response } from 'express';
import { NotFoundError, validateRequest } from '@rn-test-tickets/common';
import { Ticket } from '../models/ticket';
import { param } from 'express-validator';

const router = express.Router();

router.get(
  '/api/tickets/:id',
  param('id').isMongoId().withMessage('id must be a valid mongo ID'),
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }
    res.send(ticket);
  }
);

export { router as ticketRouter };
