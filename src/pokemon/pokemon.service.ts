import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PokemonEntity, PokemonDocument } from '../schemas/pokemon.schema';
import { Pokemon } from './pokemon.interface';
import { PokemonType } from './pokemon-type.enum';
import { findOneOrThrow } from '../utils';
import { AuthenticatedUser } from '../user/user.interface';
import { UserService } from '../user/user.service';

/**
 * Query parameters for retrieving a list of Pokémon.
 */
interface FindAllQuery {
  page?: number;
  limit?: number;
  name?: string;
  type?: string;
  favoritesOnly?: string;
}

/**
 * MongoDB filter interface for searching Pokémon.
 */
export interface PokemonFilter {
  name?: {
    $regex: string;
    $options: string;
  };
  types?: {
    $in: string[];
  };
  _id?: {
    $in: number[];
  };
}

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(PokemonEntity.name)
    private readonly pokemonModel: Model<PokemonDocument>,
    private readonly userService: UserService,
  ) {}

  /**
   * Retrieves a Pokémon by its unique ID.
   *
   * @param id - The unique identifier of the Pokémon.
   * @returns A promise that resolves to the Pokémon.
   * @throws NotFoundException if no Pokémon with the given ID is found.
   */
  async findById(id: number): Promise<Pokemon> {
    return findOneOrThrow(
      this.pokemonModel,
      { _id: id },
      `Pokemon with id ${id} not found`,
    );
  }

  /**
   * Retrieves a Pokémon by its exact name (case-insensitive).
   *
   * @param name - The exact name of the Pokémon.
   * @returns A promise that resolves to the Pokémon.
   * @throws NotFoundException if no Pokémon with the given name is found.
   */
  async findByName(name: string): Promise<Pokemon> {
    return findOneOrThrow(
      this.pokemonModel,
      { name: { $regex: `^${name}$`, $options: 'i' } },
      `Pokemon with name ${name} not found`,
    );
  }

  /**
   * Retrieves a paginated list of Pokémon filtered by various criteria.
   * Optionally, the results can be restricted to only those that are the authenticated
   * user's favorites.
   *
   * @param query - Object containing pagination and filter parameters:
   *   - page: The page number (default: 1).
   *   - limit: The number of items per page (default: 10).
   *   - name: Partial name to filter by (fuzzy, case-insensitive).
   *   - type: A comma-separated list of Pokémon types.
   *   - favoritesOnly: If set to 'true', restricts the results to only those Pokémon
   *                    whose IDs are in the authenticated user's favorites.
   * @param user - The authenticated user.
   * @returns A promise that resolves to an array of Pokémon.
   */
  async findAll(
    query: FindAllQuery,
    user: AuthenticatedUser,
  ): Promise<Pokemon[]> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const filter: PokemonFilter = {};

    // If favoritesOnly is 'true', add a filter to restrict results to the user's favorites
    if (query.favoritesOnly && query.favoritesOnly.toLowerCase() === 'true') {
      const favorites = await this.userService.getFavoritesForUser(
        user.username,
      );
      filter._id = { $in: favorites };
    }

    // Filter by name if provided
    if (query.name) {
      filter.name = { $regex: query.name, $options: 'i' };
    }

    // Filter by types if provided
    if (query.type) {
      const types: PokemonType[] = query.type
        .split(',')
        .map((t) => t.trim() as PokemonType);
      filter.types = { $in: types };
    }

    const skip = (page - 1) * limit;
    const pokemons = await this.pokemonModel
      .find(filter)
      .skip(skip)
      .limit(limit)
      .exec();
    return pokemons;
  }

  /**
   * Retrieves a distinct list of Pokémon types.
   *
   * @returns A promise that resolves to an array of unique Pokémon types.
   */
  async getTypes(): Promise<string[]> {
    return this.pokemonModel.distinct('types').exec();
  }

  /**
   * Creates a new Pokémon.
   *
   * @param pokemonData - The data for the new Pokémon.
   * @returns A promise that resolves to the created Pokémon.
   */
  async create(pokemonData: Pokemon): Promise<Pokemon> {
    const createdPokemon = new this.pokemonModel(pokemonData);
    return createdPokemon.save();
  }
}
