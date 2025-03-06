import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserEntity } from '../schemas/user.schema';
import { User } from './user.interface';

// Mock data for testing
const MOCK_USER_ID = 9999999;
const MOCK_USER_USERNAME = 'testuser';
const MOCK_USER_PASSWORD = 'password123';

const mockUser: User = {
  _id: MOCK_USER_ID,
  username: MOCK_USER_USERNAME,
  password: MOCK_USER_PASSWORD,
  favorites: [],
};

const mockUserWithFavorites: User = {
  _id: MOCK_USER_ID,
  username: MOCK_USER_USERNAME,
  password: MOCK_USER_PASSWORD,
  favorites: [1, 2, 3],
};

/**
 * FakeUserModel simulates a Mongoose model.
 * We assign static methods (findOne, findById) to allow Jest to intercept queries.
 */
class FakeUserModel {
  static findById = jest.fn();
  static findOne = jest.fn();

  private data: User;
  constructor(data: User) {
    this.data = data;
  }
  // Simulate saving the document
  save(): Promise<User> {
    return Promise.resolve(this.data);
  }
}

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(UserEntity.name),
          useValue: FakeUserModel,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return the user if found', async () => {
      // When findOne is called, simulate a successful lookup by resolving with mockUser
      FakeUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });
      await expect(service.findById(MOCK_USER_ID)).resolves.toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      // Simulate a lookup that returns null
      FakeUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });
      await expect(service.findById(MOCK_USER_ID)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('validateUser', () => {
    it('should return the user if credentials are valid', async () => {
      FakeUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });
      await expect(
        service.validateUser(MOCK_USER_USERNAME, MOCK_USER_PASSWORD),
      ).resolves.toEqual(mockUser);
    });

    it('should return null if user is not found or password does not match', async () => {
      // Simulate no user found
      FakeUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });
      await expect(
        service.validateUser(MOCK_USER_USERNAME, 'wrongpassword'),
      ).resolves.toBeNull();
    });
  });

  describe('getFavoritesForUser', () => {
    it('should return favorites if user exists', async () => {
      FakeUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUserWithFavorites),
      });
      await expect(service.getFavoritesForUser('testuser')).resolves.toEqual([
        1, 2, 3,
      ]);
    });

    it('should throw NotFoundException if user not found', async () => {
      FakeUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });
      await expect(service.getFavoritesForUser('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('toggleFavorite', () => {
    const mockUserForToggle = {
      _id: 1,
      favorites: [1, 2],
      save: jest.fn().mockResolvedValue(true),
    };

    it('should remove a favorite if it exists', async () => {
      // Start with a user having favorites [1, 2]
      FakeUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUserForToggle),
      });
      await service.toggleFavorite(1, 1);
      expect(mockUserForToggle.favorites).not.toContain(1);
      expect(mockUserForToggle.save).toHaveBeenCalled();
    });

    it('should add a favorite if it does not exist', async () => {
      // Start with a user having favorites [2]
      FakeUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUserForToggle),
      });
      await service.toggleFavorite(1, 3);
      expect(mockUserForToggle.favorites).toContain(3);
      expect(mockUserForToggle.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if user not found', async () => {
      FakeUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });
      await expect(service.toggleFavorite(1, 1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create and save a new user', async () => {
      const result = await service.create(mockUser);
      expect(result).toEqual(mockUser);
    });
  });
});
