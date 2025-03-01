import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { Pokemon } from './pokemon.interface';

@Controller('pokemons')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get(':id')
  async getPokemonById(@Param('id') id: number): Promise<Pokemon> {
    return this.pokemonService.findById(id);
  }

  @Post()
  async createPokemon(@Body() pokemonData: Pokemon): Promise<Pokemon> {
    return this.pokemonService.create(pokemonData);
  }
}
