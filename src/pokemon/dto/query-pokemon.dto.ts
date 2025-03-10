import {
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  IsEnum,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PokemonType } from '../pokemon-type.enum';

export class QueryPokemonDto {
  @ApiPropertyOptional({ description: 'Page number (default: 1)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    description: 'Number of items per page (default: 10)',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  limit?: number;

  @ApiPropertyOptional({
    description: 'Partial name for fuzzy search (case-insensitive)',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Comma-separated list of Pokémon types',
    enum: PokemonType,
    isArray: true,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      // Split the string by comma and trim each part
      return value.split(',').map((v: string) => v.trim()) as PokemonType[];
    }
    return value as PokemonType[];
  })
  @IsArray()
  @IsEnum(PokemonType, { each: true })
  types?: PokemonType[];

  @ApiPropertyOptional({
    description: 'Set to "true" to filter results to only favorites',
  })
  @IsOptional()
  @IsString()
  favoritesOnly?: string;
}
