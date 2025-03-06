import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthenticatedUser } from './user/user.interface';
import { UserService } from './user/user.service';

// Avoiding typos
const BEARER = 'Bearer ';

/**
 * AuthGuard verifies the Authorization header and attaches the authenticated user to the request.
 * It expects a Bearer token in the format "Bearer username:password".
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Extract the HTTP request from the execution context
    const request = context.switchToHttp().getRequest<{
      headers: Record<string, string>;
      user?: AuthenticatedUser;
    }>();

    // Retrieve the Authorization header
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith(BEARER)) {
      throw new UnauthorizedException('Missing or invalid Bearer token');
    }

    // Expecting username:password after Bearer
    const credentials = authHeader.slice(BEARER.length).trim();
    const [username, password] = credentials.split(':');

    // Ensure both username and password are provided
    if (!username || !password) {
      throw new UnauthorizedException(
        'Invalid credentials format. Use "Bearer username:password"',
      );
    }

    // Validate the user with the provided credentials
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    // Attach the authenticated user to the request for later use
    request.user = { _id: user._id, username: user.username };
    return true;
  }
}
