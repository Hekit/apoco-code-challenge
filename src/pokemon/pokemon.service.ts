import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PokemonEntity, PokemonDocument } from './schemas/pokemon.schema';
import { Pokemon } from './pokemon.interface';

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

  async create(pokemonData: Pokemon): Promise<Pokemon> {
    const createdPokemon = new this.pokemonModel(pokemonData);
    return createdPokemon.save();
  }
}
