import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';

let globalRequest = 0;

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private globalLimit = 100;
  private userLimit = 30;
  private customersLimit = 20;

  use(req: Request, res: Response, next: NextFunction) {
    if (globalRequest >= this.globalLimit) {
      return res.status(429).json({ message: 'Limite global de requisições atingido.' });
    }
    let routeLimit = this.globalLimit;

    if (req.originalUrl.startsWith('/users')) {
      routeLimit = this.userLimit;
    }
    if (req.originalUrl.startsWith('/customers')) {
      routeLimit = this.customersLimit;
    }

    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: routeLimit,
      message: 'Muitas requisições. Tente novamente mais tarde.',
      handler: (req, res) => {
        globalRequest++;
        res.status(429).json({ message: 'Limite de requisições atingido para essa rota.' });
      },
    });
    void limiter(req, res, (err: any) => {
      if (err) {
        return next(err);
      }
      globalRequest++;
      next();
    });
  }
}
