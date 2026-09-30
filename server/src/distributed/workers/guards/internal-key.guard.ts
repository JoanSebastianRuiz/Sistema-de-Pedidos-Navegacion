import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';

@Injectable()
export class InternalKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    const internalKey = request.headers['x-internal-key'];

    if (internalKey !== process.env.INTERNAL_WORKER_KEY) {
      throw new UnauthorizedException('Invalid internal key');
    }

    return true;
  }
}
