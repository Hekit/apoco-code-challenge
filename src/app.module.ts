import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PokemonModule } from './pokemon/pokemon.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/apoco-code-challenge'),
    PokemonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
