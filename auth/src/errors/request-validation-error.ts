import { ValidationError } from 'express-validator';
import { CustomError } from './custom-error';

export class RequestValidatorError extends CustomError {
  statusCode = 400;
  constructor(public errors: ValidationError[]) {
    super('Invalid request parameters.');

    //Don't need to set the following:
    // Object.setPrototypeOf(this, RequestValidatorError.prototype);
    //because we set new.target.prototype in abstract class CustomError:
    //Object.setPrototypeOf(this, new.target.prototype);
    //https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html#example
  }

  serializeErrors() {
    return this.errors.map((err) => {
      return { message: err.msg, field: err.param };
    });
  }
}
