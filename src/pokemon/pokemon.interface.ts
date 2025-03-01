export interface Pokemon {
  _id: number;
  name: string;
  classification: string;
  types: string[];
  resistant: string[];
  weaknesses: string[];
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
  type: string;
  damage: number;
}
