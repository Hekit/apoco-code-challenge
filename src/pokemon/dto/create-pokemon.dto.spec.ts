import { validate, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreatePokemonDto } from './create-pokemon.dto';
import { PokemonType } from '../pokemon-type.enum';

// Helper function to search recursively for a nested error with a given property
function findNestedError(errors: ValidationError[], property: string): boolean {
  for (const error of errors) {
    if (error.property === property) {
      return true;
    }
    if (error.children && error.children.length > 0) {
      if (findNestedError(error.children, property)) {
        return true;
      }
    }
  }
  return false;
}

describe('CreatePokemonDto', () => {
  const DEFAULT_PAYLOAD = {
    _id: 1,
    name: 'Bulbasaur',
    classification: 'Seed Pokémon',
    types: [PokemonType.Grass, PokemonType.Poison],
    resistant: [PokemonType.Water],
    weaknesses: [PokemonType.Fire],
    weight: { minimum: '6.04 kg', maximum: '7.76 kg' },
    height: { minimum: '0.61 m', maximum: '0.79 m' },
    fleeRate: 0.1,
    evolutionRequirements: { amount: 25, name: 'Bulbasaur Candy' },
    evolutions: [{ id: 2, name: 'Ivysaur' }],
    maxCP: 951,
    maxHP: 1071,
    attacks: {
      fast: [{ name: 'Tackle', type: PokemonType.Normal, damage: 12 }],
      special: [{ name: 'Vine Whip', type: PokemonType.Grass, damage: 25 }],
    },
  };

  it('should validate a fully populated valid DTO', async () => {
    const dto = plainToInstance(CreatePokemonDto, DEFAULT_PAYLOAD);
    const errors: ValidationError[] = await validate(dto);
    expect(errors.length).toEqual(0);
  });

  it('should return errors for missing required fields', async () => {
    const dto = plainToInstance(CreatePokemonDto, {});
    const errors = await validate(dto);
    // Expect many validation errors since required fields are missing
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should return an error when _id is not a number', async () => {
    const payload = {
      ...DEFAULT_PAYLOAD,
      _id: 'not a number', // Invalid _id
    };
    const dto = plainToInstance(CreatePokemonDto, payload);
    const errors = await validate(dto);
    expect(errors.some((err) => err.property === '_id')).toBeTruthy();
  });

  it('should return an error when nested weight property is invalid', async () => {
    const payload = {
      ...DEFAULT_PAYLOAD,
      weight: { minimum: 10, maximum: '7.76 kg' }, // Invalid: minimum should be string
    };
    const dto = plainToInstance(CreatePokemonDto, payload);
    const errors = await validate(dto);
    expect(errors.some((err) => err.property === 'weight')).toBeTruthy();
  });

  it('should return errors when attacks array contains invalid entries', async () => {
    const payload = {
      ...DEFAULT_PAYLOAD,
      attacks: {
        fast: [{ name: 'Tackle', type: PokemonType.Normal, damage: 'twelve' }], // Invalid: damage should be a number
        special: [{ name: 'Vine Whip', type: PokemonType.Grass, damage: 25 }],
      },
    };
    const dto = plainToInstance(CreatePokemonDto, payload);
    const errors: ValidationError[] = await validate(dto);
    // Check that an error exists in the nested fast attacks array regarding the damage property
    expect(findNestedError(errors, 'damage')).toBeTruthy();
  });
});
