import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.interface';
import { UserEntity, UserDocument } from '../schemas/user.schema';
import { findOneOrThrow } from '../utils';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserEntity.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  /**
   * Retrieves a user by their ID.
   * Throws a NotFoundException if the user is not found.
   *
   * @param id - The user's ID.
   * @returns The user.
   */
  async findById(id: number): Promise<User> {
    return findOneOrThrow(
      this.userModel,
      { _id: id },
      `User with id ${id} not found`,
    );
  }

  /**
   * Validates the user credentials.
   * If valid, returns the user document; otherwise, returns null.
   *
   * @param username - The user's username.
   * @param password - The user's password.
   * @returns The user document or null.
   */
  async validateUser(
    username: string,
    password: string,
  ): Promise<UserDocument | null> {
    const user = await this.userModel.findOne({ username }).exec();
    return user && user.password === password ? user : null;
  }

  /**
   * Retrieves the favorites of a user by their username.
   * Throws a NotFoundException if the user is not found.
   *
   * @param username - The username to search for.
   * @returns An array of favorite item IDs.
   */
  async getFavoritesForUser(username: string): Promise<number[]> {
    const user = await findOneOrThrow(
      this.userModel,
      { username },
      `User with name ${username} not found`,
    );
    return user.favorites;
  }

  /**
   * Toggles a favorite for a user.
   * If the favorite exists, it is removed; otherwise, it is added.
   *
   * @param userId - The user's ID.
   * @param favoriteId - The ID of the favorite item.
   * @returns The updated user document.
   */
  async toggleFavorite(userId: number, favoriteId: number) {
    const user = await findOneOrThrow(
      this.userModel,
      { _id: userId },
      `User with id ${userId} not found`,
    );

    const index = user.favorites.indexOf(favoriteId);
    if (index > -1) {
      // Remove favorite if it exists
      user.favorites.splice(index, 1);
    } else {
      // Otherwise add favorite
      user.favorites.push(favoriteId);
    }
    return user.save();
  }

  /**
   * Creates a new user.
   *
   * @param userData - The data of the user to be created.
   * @returns The newly created user.
   */
  async create(userData: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(userData);
    return createdUser.save();
  }
}
