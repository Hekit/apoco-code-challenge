import {
  Controller,
  Get,
  Query,
  Param,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  //ApiBody,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth.guard';
import { PokemonService } from './pokemon.service';
import { Pokemon } from './pokemon.interface';
import { User } from '../user/user.decorator';
import { AuthenticatedUser } from '../user/user.interface';

/**
 * Controller for managing Pokémon endpoints.
 */
@ApiTags('Pokemons')
@Controller('pokemons')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  /**
   * Retrieves a distinct list of Pokémon types.
   *
   * @returns An array of unique Pokémon types.
   */
  @Get('types')
  @ApiOperation({ summary: 'Get distinct Pokémon types' })
  @ApiResponse({
    status: 200,
    description: 'List of Pokémon types retrieved successfully.',
  })
  @Get('types')
  async getPokemonTypes(): Promise<string[]> {
    return this.pokemonService.getTypes();
  }

  /**
   * Retrieves a Pokémon by its unique ID.
   *
   * @param id The unique identifier of the Pokémon.
   * @returns The Pokémon that matches the specified ID.
   */
  @Get('id/:id')
  @ApiOperation({ summary: 'Get a Pokémon by its ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The unique identifier of the Pokémon',
  })
  @ApiResponse({ status: 200, description: 'Pokémon retrieved successfully.' })
  @Get('/id/:id')
  async getPokemonById(@Param('id') id: number): Promise<Pokemon> {
    return this.pokemonService.findById(id);
  }

  /**
   * Retrieves a Pokémon by its exact name.
   *
   * @param name The exact name of the Pokémon.
   * @returns The Pokémon that matches the specified name.
   */
  @Get('name/:name')
  @ApiOperation({ summary: 'Get a Pokémon by its name (exact match)' })
  @ApiParam({
    name: 'name',
    type: String,
    description: 'The exact name of the Pokémon',
  })
  @ApiResponse({ status: 200, description: 'Pokémon retrieved successfully.' })
  @Get('/name/:name')
  async getPokemonByName(@Param('name') name: string): Promise<Pokemon> {
    return this.pokemonService.findByName(name);
  }

  /**
   * Retrieves a paginated list of Pokémon with optional filtering.
   * Optionally, if the query parameter `favoritesOnly` is set to "true", only Pokémon that are
   * in the authenticated user's favorites will be returned.
   *
   * @param user The authenticated user.
   * @param query Query parameters for filtering and pagination:
   *   - page: The page number (default: 1).
   *   - limit: The number of items per page (default: 10).
   *   - name: Partial name for fuzzy search (case-insensitive).
   *   - types: Comma-separated list of Pokémon types.
   *   - favoritesOnly: 'true' to restrict results to only favorites.
   * @returns An array of Pokémon.
   */
  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Get a paginated list of Pokémon with optional filtering',
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    description: 'Number of items per page (default: 10)',
  })
  @ApiQuery({
    name: 'name',
    type: String,
    required: false,
    description: 'Partial name for fuzzy search (case-insensitive)',
  })
  @ApiQuery({
    name: 'types',
    type: String,
    required: false,
    description: 'Comma-separated list of Pokémon types',
  })
  @ApiQuery({
    name: 'favoritesOnly',
    type: String,
    required: false,
    description: 'Set to "true" to filter results to only favorites',
  })
  @ApiResponse({
    status: 200,
    description: 'List of Pokémon retrieved successfully.',
  })
  @Get()
  @UseGuards(AuthGuard)
  async getPokemons(
    @User() user: AuthenticatedUser,
    @Query()
    query: {
      page?: number;
      limit?: number;
      name?: string;
      types?: string;
      favoritesOnly?: string;
    },
  ): Promise<Pokemon[]> {
    return this.pokemonService.findAll(query, user);
  }

  /**
   * Creates a new Pokémon.
   *
   * @param pokemonData The data for the new Pokémon.
   * @returns The newly created Pokémon.
   */
  @Post()
  @ApiOperation({ summary: 'Create a new Pokémon' })
  //@ApiBody({ type: Pokemon })
  @ApiResponse({ status: 201, description: 'Pokémon created successfully.' })
  @Post()
  async createPokemon(@Body() pokemonData: Pokemon): Promise<Pokemon> {
    return this.pokemonService.create(pokemonData);
  }
}
