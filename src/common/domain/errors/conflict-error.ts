/* eslint-disable prettier/prettier */
import { AppError } from './app-error'

export class ConflictError extends AppError {
  constructor(message: string = 'Resource conflict') {
    super(message, 409)
    this.name = 'ConflictError'
  }
}
