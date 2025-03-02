import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PokemonEntity, PokemonDocument } from './schemas/pokemon.schema';
import { Pokemon } from './pokemon.interface';
import { PokemonType } from './pokemon-type.enum';

interface FindAllQuery {
  page?: number;
  limit?: number;
  name?: string;
  type?: string;
}

export interface PokemonFilter {
  name?: {
    $regex: string;
    $options: string;
  };
  types?: {
    $in: string[];
  };
  _id?: {
    $in: string[];
  };
}

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(PokemonEntity.name)
    private readonly pokemonModel: Model<PokemonDocument>,
  ) {}

  async findById(id: number): Promise<Pokemon> {
    const pokemon = await this.pokemonModel.findById(id).exec();
    if (!pokemon) {
      throw new NotFoundException(`Pokemon with id ${id} not found`);
    }
    return pokemon;
  }

  async findByName(name: string): Promise<Pokemon> {
    const pokemon = await this.pokemonModel
      .findOne({ name: { $regex: name, $options: 'i' } })
      .exec();
    if (!pokemon) {
      throw new NotFoundException(`Pokemon with name ${name} not found`);
    }
    return pokemon;
  }

  async findAll(query: FindAllQuery): Promise<Pokemon[]> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const filter: PokemonFilter = {};

    if (query.name) {
      filter.name = { $regex: query.name, $options: 'i' };
    }

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

  async getTypes(): Promise<string[]> {
    return this.pokemonModel.distinct('types').exec();
  }

  async create(pokemonData: Pokemon): Promise<Pokemon> {
    const createdPokemon = new this.pokemonModel(pokemonData);
    return createdPokemon.save();
  }
}
