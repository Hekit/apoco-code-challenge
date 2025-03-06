import { AuthGuard } from './auth.guard';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user/user.service';

interface FakeRequest {
  headers: Record<string, string>;
  user?: { _id: number; username: string };
}

/**
 * Helper function that creates a minimal fake ExecutionContext.
 * It returns an object with a typed fake request containing the specified headers.
 */
const createExecutionContext = (
  headers: Record<string, string>,
): ExecutionContext => {
  const fakeRequest: FakeRequest = { headers };
  return {
    switchToHttp: () => ({
      getRequest: (): FakeRequest => fakeRequest,
    }),
    // Dummy implementations for other ExecutionContext methods
    getClass: () => null,
    getHandler: () => null,
    getArgs: () => [],
    getArgByIndex: () => null,
    switchToRpc: () => null,
    switchToWs: () => null,
    getType: () => 'http',
  } as unknown as ExecutionContext;
};

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let mockUserService: Partial<UserService>;

  beforeEach(() => {
    // Mock the validateUser method
    mockUserService = {
      validateUser: jest
        .fn()
        .mockImplementation((username: string, password: string) => {
          // Simulate valid credentials
          if (username === 'testuser' && password === 'testpass') {
            return Promise.resolve({ _id: 1, username: 'testuser' });
          }
          // Return null to indicate invalid credentials
          return Promise.resolve(null);
        }),
    };
    // Initialize the AuthGuard with the mocked UserService
    authGuard = new AuthGuard(mockUserService as UserService);
  });

  it('should allow access with valid credentials', async () => {
    // Create a typed fake request
    const fakeRequest: FakeRequest = {
      headers: { authorization: 'Bearer testuser:testpass' },
    };

    // Create a minimal context that returns the typed fake request
    const context = {
      switchToHttp: () => ({
        getRequest: (): FakeRequest => fakeRequest,
      }),
    } as unknown as ExecutionContext;

    // Verify the guard functionality
    await expect(authGuard.canActivate(context)).resolves.toBe(true);
    // Also verify that the user is attached to the request object
    expect(fakeRequest.user).toEqual({ _id: 1, username: 'testuser' });
  });

  it('should throw UnauthorizedException if Authorization header is missing', async () => {
    // Create context with no headers
    const context = createExecutionContext({});
    await expect(authGuard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException if credentials format is wrong', async () => {
    // Missing colon between username and password
    const context = createExecutionContext({
      authorization: 'Bearer invalidformat',
    });
    await expect(authGuard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException if user credentials are invalid', async () => {
    // Create context with invalid credentials
    const context = createExecutionContext({
      authorization: 'Bearer wronguser:wrongpass',
    });
    await expect(authGuard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
