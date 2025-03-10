import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { QueryPokemonDto } from './query-pokemon.dto';

describe('QueryPokemonDto', () => {
  it('should validate a fully populated valid DTO', async () => {
    const payload = {
      page: '2',
      limit: '20',
      name: 'saur',
      type: 'Grass,Poison',
      favoritesOnly: 'true',
    };
    const dto = plainToInstance(QueryPokemonDto, payload);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
    // Verify that the transformation converted page and limit to numbers
    expect(dto.page).toBe(2);
    expect(dto.limit).toBe(20);
  });

  it('should allow missing optional fields', async () => {
    const dto = plainToInstance(QueryPokemonDto, {});
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should return an error if page is not a valid number', async () => {
    const payload = { page: 'not-a-number' };
    const dto = plainToInstance(QueryPokemonDto, payload);
    const errors = await validate(dto);
    expect(errors.some((error) => error.property === 'page')).toBeTruthy();
  });

  it('should return an error if limit is not a valid number', async () => {
    const payload = { limit: 'NaN' };
    const dto = plainToInstance(QueryPokemonDto, payload);
    const errors = await validate(dto);
    expect(errors.some((error) => error.property === 'limit')).toBeTruthy();
  });

  it('should return an error if favoritesOnly is not a string', async () => {
    const payload = { favoritesOnly: 123 };
    const dto = plainToInstance(QueryPokemonDto, payload);
    const errors = await validate(dto);
    expect(
      errors.some((error) => error.property === 'favoritesOnly'),
    ).toBeTruthy();
  });

  it('should return an error if type is not a string', async () => {
    const payload = { types: 456 };
    const dto = plainToInstance(QueryPokemonDto, payload);
    const errors = await validate(dto);
    expect(errors.some((error) => error.property === 'types')).toBeTruthy();
  });

  it('should transform a comma-separated string into an array', () => {
    const payload = { types: 'Grass,Poison' };
    const dto = plainToInstance(QueryPokemonDto, payload);
    expect(dto.types).toEqual(['Grass', 'Poison']);
  });

  it('should return the value unchanged if not a string', () => {
    const payload = { types: ['Fire', 'Water'] };
    const dto = plainToInstance(QueryPokemonDto, payload);
    expect(dto.types).toEqual(['Fire', 'Water']);
  });
});
