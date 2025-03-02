import { Test, TestingModule } from '@nestjs/testing';
import { PokemonService } from './pokemon.service';
import { getModelToken } from '@nestjs/mongoose';
import { PokemonEntity } from './schemas/pokemon.schema';
import { NotFoundException } from '@nestjs/common';
import { Pokemon } from './pokemon.interface';

describe('PokemonService', () => {
  let service: PokemonService;

  const fakePokemon: Pokemon = {
    _id: 1,
    name: 'Bulbasaur',
    classification: 'Seed Pokémon',
    types: ['Grass', 'Poison'],
    resistant: ['Water', 'Electric', 'Grass', 'Fighting', 'Fairy'],
    weaknesses: ['Fire', 'Ice', 'Flying', 'Psychic'],
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
        { name: 'Tackle', type: 'Normal', damage: 12 },
        { name: 'Vine Whip', type: 'Grass', damage: 7 },
      ],
      special: [
        { name: 'Power Whip', type: 'Grass', damage: 70 },
        { name: 'Seed Bomb', type: 'Grass', damage: 40 },
        { name: 'Sludge Bomb', type: 'Poison', damage: 55 },
      ],
    },
  };

  class FakePokemonModel {
    // Static methods for queries - we'll assign Jest mocks to these in our tests
    static findById = jest.fn();
    static findOne = jest.fn();

    private data: Pokemon;
    constructor(data: Pokemon) {
      this.data = data;
    }
    save(): Promise<Pokemon> {
      return Promise.resolve(this.data);
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PokemonService,
        {
          provide: getModelToken(PokemonEntity.name),
          useValue: FakePokemonModel,
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
      FakePokemonModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(fakePokemon),
      });
      const result = await service.findById(fakePokemon._id);
      expect(result).toEqual(fakePokemon);
      expect(FakePokemonModel.findById).toHaveBeenCalledWith(fakePokemon._id);
    });

    it('should throw NotFoundException if not found', async () => {
      FakePokemonModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });
      await expect(service.findById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByName', () => {
    it('should return a pokemon if found by name', async () => {
      FakePokemonModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(fakePokemon),
      });
      const result = await service.findByName('bulbasaur');
      expect(result).toEqual(fakePokemon);
      expect(FakePokemonModel.findOne).toHaveBeenCalledWith({
        name: { $regex: 'bulbasaur', $options: 'i' },
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

  describe('create', () => {
    it('should create and return a pokemon', async () => {
      const result = await service.create(fakePokemon);
      expect(result).toEqual(fakePokemon);
    });
  });
});
