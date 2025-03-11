import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Body,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth.guard';
import { User as UserDecorator } from './user.decorator';
import { UserService } from './user.service';
import { AuthenticatedUser, User } from './user.interface';
import { CreateUserDto } from './dto/create-user.dto';

/**
 * Controller responsible for handling user-related requests
 */
@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Toggles a favorite item for the authenticated user.
   *
   * Expects a route parameter for the favorite ID and uses the authentication guard to
   * ensure that the user is logged in.
   *
   * @param user The authenticated user injected via the custom decorator.
   * @param favoriteId The ID of the favorite item.
   * @returns The updated user record.
   */
  @Patch('/favorites/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Toggle a favorite item for the authenticated user',
  })
  @ApiParam({
    name: 'id',
    description: 'The favorite item ID to toggle',
    type: Number,
  })
  @ApiResponse({ status: 200, description: 'User updated successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async toggleFavorite(
    @UserDecorator() user: AuthenticatedUser,
    @Param('id', ParseIntPipe) favoriteId: number,
  ): Promise<User> {
    return this.userService.toggleFavorite(user._id, favoriteId);
  }

  /**
   * Retrieves the favorites for the authenticated user.
   *
   * @param user The authenticated user injected via the custom decorator.
   * @returns An array of favorite item IDs.
   */
  @Get('/favorites')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: "Get the authenticated user's favorites" })
  @ApiResponse({
    status: 200,
    description: 'Favorites retrieved successfully.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async getFavorites(
    @UserDecorator() user: AuthenticatedUser,
  ): Promise<number[]> {
    return this.userService.getFavoritesForUser(user.username);
  }

  /**
   * Creates a new user.
   *
   * @param userData The data of the new user.
   * @returns The newly created user record.
   */
  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request. Invalid user data.' })
  async createUser(@Body() userData: CreateUserDto): Promise<User> {
    return this.userService.create(userData);
  }
}
