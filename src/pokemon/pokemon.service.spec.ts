import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonEntity } from '../schemas/pokemon.schema';
import { Pokemon } from './pokemon.interface';
import { PokemonType } from './pokemon-type.enum';
import { AuthenticatedUser, User } from '../user/user.interface';
import { UserService } from '../user/user.service';
import { UserEntity } from '../schemas/user.schema';

describe('PokemonService', () => {
  let service: PokemonService;

  const mockUserWithFavorites: AuthenticatedUser = {
    _id: 1,
    username: 'user',
  };

  const mockPokemon: Pokemon = {
    _id: 1,
    name: 'Bulbasaur',
    classification: 'Seed Pokémon',
    types: [PokemonType.Grass, PokemonType.Poison],
    resistant: [
      PokemonType.Water,
      PokemonType.Electric,
      PokemonType.Grass,
      PokemonType.Fighting,
      PokemonType.Fairy,
    ],
    weaknesses: [
      PokemonType.Fire,
      PokemonType.Ice,
      PokemonType.Flying,
      PokemonType.Psychic,
    ],
    weight: { minimum: '6.04kg', maximum: '7.76kg' },
    height: { minimum: '0.61m', maximum: '0.79m' },
    fleeRate: 0.1,
    evolutionRequirements: { amount: 25, name: 'Bulbasaur candies' },
    evolutions: [
      { id: 2, name: 'Ivysaur' },
      { id: 3, name: 'Venusaur' },
    ],
    maxCP: 951,
    maxHP: 1071,
    attacks: {
      fast: [
        { name: 'Tackle', type: PokemonType.Normal, damage: 12 },
        { name: 'Vine Whip', type: PokemonType.Grass, damage: 7 },
      ],
      special: [
        { name: 'Power Whip', type: PokemonType.Grass, damage: 70 },
        { name: 'Seed Bomb', type: PokemonType.Grass, damage: 40 },
        { name: 'Sludge Bomb', type: PokemonType.Poison, damage: 55 },
      ],
    },
  };

  class FakePokemonModel {
    // Static methods for queries - we'll assign Jest mocks to these in our tests
    static findOne = jest.fn();
    static distinct = jest.fn();
    static find: jest.Mock;

    private data: Pokemon;
    constructor(data: Pokemon) {
      this.data = data;
    }
    save(): Promise<Pokemon> {
      return Promise.resolve(this.data);
    }
  }

  class FakeUserModel {
    static findOne = jest.fn();

    private data: User;
    constructor(data: User) {
      this.data = data;
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PokemonService,
        UserService,
        {
          provide: getModelToken(PokemonEntity.name),
          useValue: FakePokemonModel,
        },
        {
          provide: getModelToken(UserEntity.name),
          useValue: FakeUserModel,
        },
      ],
    }).compile();

    service = module.get<PokemonService>(PokemonService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return a pokemon if found', async () => {
      FakePokemonModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockPokemon),
      });
      const result = await service.findById(mockPokemon._id);
      expect(result).toEqual(mockPokemon);
      expect(FakePokemonModel.findOne).toHaveBeenCalledWith({
        _id: mockPokemon._id,
      });
    });

    it('should throw NotFoundException if not found', async () => {
      FakePokemonModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });
      await expect(service.findById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByName', () => {
    it('should return a pokemon if found by name', async () => {
      FakePokemonModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockPokemon),
      });
      const result = await service.findByName('bulbasaur');
      expect(result).toEqual(mockPokemon);
      expect(FakePokemonModel.findOne).toHaveBeenCalledWith({
        name: { $regex: '^bulbasaur$', $options: 'i' },
      });
    });

    it('should throw NotFoundException if not found by name', async () => {
      FakePokemonModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });
      await expect(service.findByName('unknown')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    FakePokemonModel.find = jest.fn().mockReturnValue({
      skip: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([mockPokemon]),
    });

    it('should return all pokemons without filters', async () => {
      // Assign a static "find" method for findAll.
      const result = await service.findAll({}, mockUserWithFavorites);
      expect(result).toEqual([mockPokemon]);
      expect(FakePokemonModel.find).toHaveBeenCalledWith({});
    });

    it('should filter by name (case-insensitive)', async () => {
      const result = await service.findAll(
        { name: 'bulb' },
        mockUserWithFavorites,
      );
      expect(result).toEqual([mockPokemon]);
      expect(FakePokemonModel.find).toHaveBeenCalledWith({
        name: { $regex: 'bulb', $options: 'i' },
      });
    });

    it('should filter by multiple types', async () => {
      const result = await service.findAll(
        { types: [PokemonType.Grass, PokemonType.Poison] },
        mockUserWithFavorites,
      );
      expect(result).toEqual([mockPokemon]);
      expect(FakePokemonModel.find).toHaveBeenCalledWith({
        types: { $in: ['Grass', 'Poison'] },
      });
    });

    it('should paginate results', async () => {
      const result = await service.findAll(
        { page: 2, limit: 5 },
        mockUserWithFavorites,
      );
      expect(result).toEqual([mockPokemon]);
    });

    it('should return favorites only', async () => {
      jest
        .spyOn(service['userService'], 'getFavoritesForUser')
        .mockResolvedValue([mockPokemon._id]);

      const result = await service.findAll(
        { favoritesOnly: 'true' },
        mockUserWithFavorites,
      );
      expect(result).toEqual([mockPokemon]);
      expect(FakePokemonModel.find).toHaveBeenCalledWith({
        _id: { $in: [mockPokemon._id] },
      });
    });
  });

  describe('getTypes', () => {
    it('should return an array of distinct types', async () => {
      FakePokemonModel.distinct.mockReturnValue({
        exec: jest.fn().mockResolvedValue(['Grass', 'Poison', 'Fire']),
      });
      const result = await service.getTypes();
      expect(result).toEqual(['Grass', 'Poison', 'Fire']);
      expect(FakePokemonModel.distinct).toHaveBeenCalledWith('types');
    });
  });

  describe('create', () => {
    it('should create and return a pokemon', async () => {
      const result = await service.create(mockPokemon);
      expect(result).toEqual(mockPokemon);
    });
  });
});
