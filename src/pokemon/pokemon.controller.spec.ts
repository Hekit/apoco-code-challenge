import { PokemonController } from './pokemon.controller';
import { PokemonService } from './pokemon.service';
import { Pokemon } from './pokemon.interface';
import { AuthenticatedUser } from '../user/user.interface';
import { PokemonType } from './pokemon-type.enum';

describe('PokemonController', () => {
  let controller: PokemonController;
  let service: PokemonService;

  beforeEach(() => {
    // Create a dummy service with jest.fn() mocks for each method.
    service = {
      getTypes: jest.fn(),
      findById: jest.fn(),
      findByName: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
    } as unknown as PokemonService;

    // Instantiate the controller with the mocked service.
    controller = new PokemonController(service);
  });

  describe('getPokemonTypes', () => {
    it('should return an array of Pokemon types', async () => {
      const types = ['Fire', 'Water'];
      const getTypesSpy = jest
        .spyOn(service, 'getTypes')
        .mockResolvedValue(types);

      const result = await controller.getPokemonTypes();
      expect(result).toEqual(types);
      expect(getTypesSpy).toHaveBeenCalled();
    });
  });

  describe('getPokemonById', () => {
    it('should return a Pokemon by id', async () => {
      const dummyPokemon = {
        _id: 1,
        name: 'Bulbasaur',
      } as Partial<Pokemon> as Pokemon;
      const findByIdSpy = jest
        .spyOn(service, 'findById')
        .mockResolvedValue(dummyPokemon);

      const result = await controller.getPokemonById(1);
      expect(result).toEqual(dummyPokemon);
      expect(findByIdSpy).toHaveBeenCalledWith(1);
    });
  });

  describe('getPokemonByName', () => {
    it('should return a Pokemon by name', async () => {
      const dummyPokemon = {
        _id: 1,
        name: 'Bulbasaur',
      } as Partial<Pokemon> as Pokemon;
      const findByNameSpy = jest
        .spyOn(service, 'findByName')
        .mockResolvedValue(dummyPokemon);

      const result = await controller.getPokemonByName('Bulbasaur');
      expect(result).toEqual(dummyPokemon);
      expect(findByNameSpy).toHaveBeenCalledWith('Bulbasaur');
    });
  });

  describe('getPokemons', () => {
    it('should return a list of Pokemons with filters', async () => {
      const dummyUser: AuthenticatedUser = { _id: 1, username: 'testuser' };
      const query = {
        page: 1,
        limit: 10,
        name: 'Pika',
        types: [PokemonType.Electric],
        favoritesOnly: 'true',
      };
      const pokemons = [
        { _id: 1, name: 'Pikachu' },
        { _id: 2, name: 'Raichu' },
      ] as Partial<Pokemon>[] as Pokemon[];
      const findAllSpy = jest
        .spyOn(service, 'findAll')
        .mockResolvedValue(pokemons);

      const result = await controller.getPokemons(dummyUser, query);
      expect(result).toEqual(pokemons);
      expect(findAllSpy).toHaveBeenCalledWith(query, dummyUser);
    });
  });

  describe('createPokemon', () => {
    it('should create and return a new Pokemon', async () => {
      const newPokemon = {
        _id: 3,
        name: 'Charmander',
      } as Partial<Pokemon> as Pokemon;
      const createSpy = jest
        .spyOn(service, 'create')
        .mockResolvedValue(newPokemon);

      const result = await controller.createPokemon(newPokemon);
      expect(result).toEqual(newPokemon);
      expect(createSpy).toHaveBeenCalledWith(newPokemon);
    });
  });
});
