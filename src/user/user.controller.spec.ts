import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthenticatedUser, User } from './user.interface';
import { UserDocument } from '../schemas/user.schema';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  // Dummy authenticated user that would be injected via the custom decorator.
  const dummyUser: AuthenticatedUser = { _id: 1, username: 'testuser' };

  beforeEach(() => {
    // Create a fake UserService with jest.fn() mocks for the methods used.
    service = {
      toggleFavorite: jest.fn(),
      getFavoritesForUser: jest.fn(),
      create: jest.fn(),
    } as unknown as UserService;

    // Instantiate the controller with the mocked service.
    controller = new UserController(service);
  });

  describe('toggleFavorite', () => {
    it('should toggle a favorite and return the updated user', async () => {
      const favoriteId = 42;
      const updatedUser = {
        _id: 1,
        username: 'testuser',
        password: 'password',
        favorites: [favoriteId],
      } as UserDocument;
      const toggleFavoriteSpy = jest
        .spyOn(service, 'toggleFavorite')
        .mockResolvedValue(updatedUser);

      const result = await controller.toggleFavorite(dummyUser, favoriteId);

      expect(result).toEqual(updatedUser);
      expect(toggleFavoriteSpy).toHaveBeenCalledWith(dummyUser._id, favoriteId);
    });
  });

  describe('getFavorites', () => {
    it('should return the favorites for the authenticated user', async () => {
      const favorites = [42, 43];
      const getFavoritesForUserSpy = jest
        .spyOn(service, 'getFavoritesForUser')
        .mockResolvedValue(favorites);

      const result = await controller.getFavorites(dummyUser);

      expect(result).toEqual(favorites);
      expect(getFavoritesForUserSpy).toHaveBeenCalledWith(dummyUser.username);
    });
  });

  describe('createUser', () => {
    it('should create a new user and return it', async () => {
      const newUser: User = {
        _id: 2,
        username: 'newuser',
        password: 'pswd',
        favorites: [],
      };
      const createSpy = jest
        .spyOn(service, 'create')
        .mockResolvedValue(newUser);

      const result = await controller.createUser(newUser);

      expect(result).toEqual(newUser);
      expect(createSpy).toHaveBeenCalledWith(newUser);
    });
  });
});
