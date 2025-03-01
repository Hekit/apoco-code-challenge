import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { PokemonService } from 'src/pokemon/pokemon.service';
import pokemonSeedData from './pokemon.json';
import { Pokemon } from 'src/pokemon/pokemon.interface';
import { NotFoundException } from '@nestjs/common';

interface RawPokemonData extends Omit<Pokemon, 'id'> {
  id: string;
}

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const pokemonService = appContext.get(PokemonService);

  // Cast the JSON data to an array of Pokemon
  const pokemons: Pokemon[] = (pokemonSeedData as RawPokemonData[]).map(
    (p) => ({
      ...p,
      _id: parseInt(p.id, 10),
    }),
  );

  for (const pokemon of pokemons) {
    let existing: Pokemon | null = null;
    try {
      existing = await pokemonService.findById(pokemon._id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        // Not found is expected, so we set existing to null and move on
        existing = null;
      } else {
        // Re-throw other errors
        throw error;
      }
    }

    if (!existing) {
      await pokemonService.create(pokemon);
    }
  }
  console.log('Seeding complete!');
  await appContext.close();
}

bootstrap();
