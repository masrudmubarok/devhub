import { Request, Response, NextFunction } from 'express';

export class ErrorMiddleware {
  static handle(err: Error, req: Request, res: Response, next: NextFunction) {
    console.error('Error:', err);

    const statusCode = (err as any).statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
      error: err.name || 'Error',
      message,
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
    });
  }
}
