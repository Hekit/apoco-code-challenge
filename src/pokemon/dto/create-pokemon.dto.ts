import {
  IsNumber,
  IsString,
  IsEnum,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PokemonType } from '../pokemon-type.enum';

class WeightDto {
  @ApiProperty({ description: 'Minimum weight value' })
  @IsString()
  minimum: string;

  @ApiProperty({ description: 'Maximum weight value' })
  @IsString()
  maximum: string;
}

class HeightDto {
  @ApiProperty({ description: 'Minimum height value' })
  @IsString()
  minimum: string;

  @ApiProperty({ description: 'Maximum height value' })
  @IsString()
  maximum: string;
}

class EvolutionRequirementsDto {
  @ApiProperty({ description: 'Amount required for evolution' })
  @IsNumber()
  amount: number;

  @ApiProperty({ description: 'Name associated with evolution requirement' })
  @IsString()
  name: string;
}

class EvolutionDto {
  @ApiProperty({ description: 'Unique identifier of the evolution' })
  @IsNumber()
  id: number;

  @ApiProperty({ description: 'Name of the evolution' })
  @IsString()
  name: string;
}

class AttackDto {
  @ApiProperty({ description: 'Name of the attack' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Type of the attack', enum: PokemonType })
  @IsEnum(PokemonType)
  type: PokemonType;

  @ApiProperty({ description: 'Damage of the attack' })
  @IsNumber()
  damage: number;
}

class AttacksDto {
  @ApiProperty({ description: 'List of fast attacks', type: [AttackDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttackDto)
  fast: AttackDto[];

  @ApiProperty({ description: 'List of special attacks', type: [AttackDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttackDto)
  special: AttackDto[];
}

export class CreatePokemonDto {
  @ApiProperty({ description: 'Unique identifier for the Pokémon' })
  @IsNumber()
  _id: number;

  @ApiProperty({ description: 'Name of the Pokémon' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Classification of the Pokémon' })
  @IsString()
  classification: string;

  @ApiProperty({
    description: 'List of Pokémon types',
    enum: PokemonType,
    isArray: true,
  })
  @IsArray()
  @IsEnum(PokemonType, { each: true })
  types: PokemonType[];

  @ApiProperty({
    description: 'Types the Pokémon is resistant to',
    enum: PokemonType,
    isArray: true,
  })
  @IsArray()
  @IsEnum(PokemonType, { each: true })
  resistant: PokemonType[];

  @ApiProperty({
    description: 'Pokémon weaknesses',
    enum: PokemonType,
    isArray: true,
  })
  @IsArray()
  @IsEnum(PokemonType, { each: true })
  weaknesses: PokemonType[];

  @ApiProperty({ description: 'Weight information', type: WeightDto })
  @ValidateNested()
  @Type(() => WeightDto)
  weight: WeightDto;

  @ApiProperty({ description: 'Height information', type: HeightDto })
  @ValidateNested()
  @Type(() => HeightDto)
  height: HeightDto;

  @ApiProperty({ description: 'Flee rate of the Pokémon' })
  @IsNumber()
  fleeRate: number;

  @ApiProperty({
    description: 'Evolution requirements',
    type: EvolutionRequirementsDto,
  })
  @ValidateNested()
  @Type(() => EvolutionRequirementsDto)
  evolutionRequirements: EvolutionRequirementsDto;

  @ApiProperty({ description: 'Evolutions', type: [EvolutionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EvolutionDto)
  evolutions: EvolutionDto[];

  @ApiProperty({ description: 'Maximum CP of the Pokémon' })
  @IsNumber()
  maxCP: number;

  @ApiProperty({ description: 'Maximum HP of the Pokémon' })
  @IsNumber()
  maxHP: number;

  @ApiProperty({ description: 'Attacks information', type: AttacksDto })
  @ValidateNested()
  @Type(() => AttacksDto)
  attacks: AttacksDto;
}
