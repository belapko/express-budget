import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
// Calls strategy with jwt
export class JwtGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    if (!user) {
      throw new ForbiddenException(err || info);
    }
    return user;
  }
}
