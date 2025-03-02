import { PokemonType } from './pokemon-type.enum';

export interface Pokemon {
  _id: number;
  name: string;
  classification: string;
  types: PokemonType[];
  resistant: PokemonType[];
  weaknesses: PokemonType[];
  weight: Weight;
  height: Height;
  fleeRate: number;
  evolutionRequirements: EvolutionRequirements;
  evolutions: Evolution[];
  maxCP: number;
  maxHP: number;
  attacks: Attacks;
}

export interface Weight {
  minimum: string;
  maximum: string;
}

export interface Height {
  minimum: string;
  maximum: string;
}

export interface EvolutionRequirements {
  amount: number;
  name: string;
}

export interface Evolution {
  id: number;
  name: string;
}

export interface Attacks {
  fast: Attack[];
  special: Attack[];
}

export interface Attack {
  name: string;
  type: PokemonType;
  damage: number;
}
