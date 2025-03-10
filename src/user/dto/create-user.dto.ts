import { IsNumber, IsString, IsArray, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'Unique identifier for the user' })
  @IsNumber()
  _id: number;

  @ApiProperty({ description: 'Username of the user' })
  @IsString()
  username: string;

  @ApiProperty({ description: 'Password for the user' })
  @IsString()
  password: string;

  @ApiPropertyOptional({
    description: 'Array of favorite Pokémon IDs',
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  favorites?: number[];
}
