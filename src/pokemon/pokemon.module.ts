import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PokemonService } from './pokemon.service';
import { PokemonEntity, PokemonSchema } from './schemas/pokemon.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PokemonEntity.name, schema: PokemonSchema },
    ]),
  ],
  controllers: [],
  providers: [PokemonService],
})
export class PokemonModule {}
