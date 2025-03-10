import 'reflect-metadata';
import { ExecutionContext } from '@nestjs/common';
import { userFactory } from './user.decorator';
import { AuthenticatedUser } from './user.interface';

// Define a minimal type that resembles HttpArgumentsHost.
type DummyHttpArgumentsHost = {
  getRequest: <T>() => T;
  getResponse: <T>() => T;
  getNext: <T>() => T;
};

describe('User decorator', () => {
  it('should extract the authenticated user from the request', () => {
    const dummyUser: AuthenticatedUser = { _id: 1, username: 'testuser' };

    const httpArgumentsHost: DummyHttpArgumentsHost = {
      getRequest: <T>() => ({ user: dummyUser }) as unknown as T,
      getResponse: <T>() => ({}) as T,
      getNext: <T>() => ({}) as T,
    };

    // Create a dummy ExecutionContext that returns your dummy HTTP host.
    const executionContext = {
      switchToHttp: () => httpArgumentsHost,
    } as unknown as ExecutionContext;

    // Call the factory directly.
    const result = userFactory(null, executionContext);
    expect(result).toEqual(dummyUser);
  });
});
