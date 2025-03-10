import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedUser } from './user.interface';

/**
 * Custom decorator to extract the authenticated user from the HTTP request.
 *
 * This decorator retrieves the `user` property attached to the request by a preceding authentication guard.
 * It can be used to inject the authenticated user into a controller method.
 *
 * @param data (Unused) custom data (if any).
 * @param ctx The execution context providing access to the request.
 * @returns The authenticated user extracted from the request.
 */
export const userFactory = (
  data: unknown,
  ctx: ExecutionContext,
): AuthenticatedUser => {
  const request = ctx.switchToHttp().getRequest<{ user: AuthenticatedUser }>();
  return request.user;
};

export const User = createParamDecorator(userFactory);
