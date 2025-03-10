import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PokemonModule } from './pokemon/pokemon.module';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://localhost:27017/apoco-code-challenge',
    ),
    PokemonModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
