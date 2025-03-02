import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { Server } from 'net';

describe('PokemonController (e2e)', () => {
  let app: INestApplication<Server>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /pokemons/:id should return a pokemon if it exists', async () => {
    await request(app.getHttpServer())
      .get(`/pokemons/1`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('name', 'Bulbasaur');
      });
  });

  it('GET /pokemons/:id should return 404 for non-existent pokemon', async () => {
    await request(app.getHttpServer()).get('/pokemons/999').expect(404);
  });

  it('GET /pokemons/search should return a pokemon if it is found', async () => {
    await request(app.getHttpServer())
      .get('/pokemons/search?name=bulbasaur')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('name', 'Bulbasaur');
      });
  });
});
