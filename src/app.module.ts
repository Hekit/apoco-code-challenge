import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PokemonModule } from './pokemon/pokemon.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/apoco-code-challenge'),
    PokemonModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
