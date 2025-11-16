import { Request, Response, NextFunction } from 'express';
import { RateLimiterMemory } from 'rate-limiter-flexible';

export class RateLimitMiddleware {
  private static rateLimiter = new RateLimiterMemory({
    points: 100, // Number of requests
    duration: 60, // Per 60 seconds
  });

  static async limit(req: Request, res: Response, next: NextFunction) {
    try {
      const key = req.ip || 'anonymous';
      await RateLimitMiddleware.rateLimiter.consume(key);
      next();
    } catch (error) {
      res.status(429).json({
        error: 'Too Many Requests',
        message: 'Rate limit exceeded. Please try again later.',
      });
    }
  }
}
