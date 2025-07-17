class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
  details?: any;

  constructor(message: string, statusCode: number = 500, details?: any) {
    super(message);
    
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

export { AppError };