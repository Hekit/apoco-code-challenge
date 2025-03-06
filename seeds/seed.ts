import { NestFactory } from '@nestjs/core';
import { NotFoundException } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { Pokemon } from 'src/pokemon/pokemon.interface';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.interface';

import pokemonSeedData from './pokemon.json';
import userSeedData from './user.json';

/**
 * Seed script to populate the database with Pokemon and User data.
 *
 * This script uses the Nest application context to retrieve services and
 * conditionally creates new records if they do not already exist.
 */

// Reflect raw JSON structure (id is a string) in Pokemon interface
interface RawPokemonData extends Omit<Pokemon, 'id'> {
  id: string;
}

// Common interface for models with an _id property
interface Identifiable {
  _id: string | number;
}

interface CRUDService<T extends Identifiable> {
  findById(id: T['_id']): Promise<T>;
  create(item: T): Promise<T>;
}

/**
 * Adds items to the database only if they don't already exist.
 *
 * This function concurrently processes each item:
 * - It checks if the item exists by calling findById.
 * - If findById throws a NotFoundException or returns null, it creates the item.
 *
 * @param items - Array of items to seed.
 * @param service - The CRUD service to use for database operations.
 */
async function addIfNotExisting<T extends Identifiable>(
  items: T[],
  service: CRUDService<T>,
) {
  await Promise.all(
    items.map(async (item) => {
      try {
        const existing = await service.findById(item._id);
        if (!existing) {
          await service.create(item);
        }
      } catch (error) {
        // If the item is not found, create it.
        if (error instanceof NotFoundException) {
          await service.create(item);
        } else {
          // Re-throw any other errors.
          throw error;
        }
      }
    }),
  );
}

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);

  // Seed pokemons
  // Cast the JSON data to an array of Pokemon
  const pokemons: Pokemon[] = (pokemonSeedData as RawPokemonData[]).map(
    (p) => ({
      ...p,
      _id: parseInt(p.id, 10),
    }),
  );
  const pokemonService = appContext.get(PokemonService);
  await addIfNotExisting(pokemons, pokemonService);

  // Seed users
  const users: User[] = userSeedData as User[];
  const userService = appContext.get(UserService);
  await addIfNotExisting(users, userService);

  await appContext.close();
  console.log('Seeding complete!');
}

// Handle any errors from bootstrap
bootstrap().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
