import { Controller, Get, Query, Param, Post, Body } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { Pokemon } from './pokemon.interface';

@Controller('pokemons')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get('search')
  async getPokemons(
    @Query()
    query: {
      page?: number;
      limit?: number;
      name?: string;
      types?: string;
    },
  ): Promise<Pokemon[]> {
    return this.pokemonService.findAll(query);
  }

  @Get(':id')
  async getPokemonById(@Param('id') id: number): Promise<Pokemon> {
    return this.pokemonService.findById(id);
  }

  @Get()
  async getPokemonByName(@Query('name') name: string): Promise<Pokemon> {
    return this.pokemonService.findByName(name);
  }

  @Post()
  async createPokemon(@Body() pokemonData: Pokemon): Promise<Pokemon> {
    return this.pokemonService.create(pokemonData);
  }
}
