import { CustomError } from './custom-error';
const message = 'Error connecting to database.';
export class DatabaseConnectionError extends CustomError {
  statusCode = 500;
  message = message;
  constructor() {
    super(message);
  }

  serializeErrors() {
    return [
      {
        message: message,
      },
    ];
  }
}
