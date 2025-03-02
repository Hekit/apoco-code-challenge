import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Pokemon } from '../pokemon.interface';
import { PokemonType } from '../pokemon-type.enum';

@Schema({ collection: 'pokemons' })
export class PokemonEntity implements Pokemon {
  @Prop({ type: Number, required: true })
  _id: number;

  @Prop({ required: true })
  name: string;

  @Prop()
  classification: string;

  @Prop({ type: [String], index: true })
  types: PokemonType[];

  @Prop([String])
  resistant: PokemonType[];

  @Prop([String])
  weaknesses: PokemonType[];

  @Prop({ type: Object })
  weight: { minimum: string; maximum: string };

  @Prop({ type: Object })
  height: { minimum: string; maximum: string };

  @Prop({ required: true })
  fleeRate: number;

  @Prop({ type: Object })
  evolutionRequirements: { amount: number; name: string };

  @Prop({ type: Array, default: [] })
  evolutions: { id: number; name: string }[];

  @Prop({})
  maxCP: number;

  @Prop({})
  maxHP: number;

  @Prop({ type: Object })
  attacks: {
    fast: { name: string; type: PokemonType; damage: number }[];
    special: { name: string; type: PokemonType; damage: number }[];
  };
}

export type PokemonDocument = PokemonEntity & Document;
export const PokemonSchema = SchemaFactory.createForClass(PokemonEntity);
