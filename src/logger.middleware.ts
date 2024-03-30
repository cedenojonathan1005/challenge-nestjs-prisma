import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { omit } from 'lodash';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly _logger: Logger) {}

  use(req: FastifyRequest, _res: FastifyReply, next): void {
    this._logger.log(
      omit({
        method: req.method,
        headers: { authorization: req.headers.authorization },
        query: req.query,
        body: req.body,
        params: req.params,
      }),
      req.url,
    );
    next();
  }
}
