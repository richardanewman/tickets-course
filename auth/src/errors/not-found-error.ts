import { CustomError } from './custom-error';
const message = 'Not found.';
export class NotFoundError extends CustomError {
  statusCode = 404;

  constructor() {
    super(message);

    // Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [{ message: message }];
  }
}
