import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { Server } from 'net';
import { Pokemon } from 'src/pokemon/pokemon.interface';

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

  it('GET /pokemons?name should return a pokemon if it is found', async () => {
    await request(app.getHttpServer())
      .get('/pokemons?name=bulbasaur')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('name', 'Bulbasaur');
      });
  });

  it('GET /pokemons/search should return a paginated list', async () => {
    const res = await request(app.getHttpServer())
      .get('/pokemons/search?page=1&limit=10')
      .expect(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it('GET /pokemons/search?name=bulb should return filtered results by name', async () => {
    const res = await request(app.getHttpServer())
      .get('/pokemons/search?name=bulb')
      .expect(200);
    (res.body as Pokemon[]).forEach((pokemon: Pokemon) => {
      expect(pokemon.name.toLowerCase()).toContain('bulb');
    });
  });

  it('GET /pokemons/search?type=Grass,Poison should return pokemons matching either type', async () => {
    const res = await request(app.getHttpServer())
      .get('/pokemons/search?type=Grass,Poison')
      .expect(200);
    (res.body as Pokemon[]).forEach((pokemon: Pokemon) => {
      // Check that at least one type is in the allowed list.
      const types: string[] = pokemon.types;
      expect(types.includes('Grass') || types.includes('Poison')).toBe(true);
    });
  });

  it('GET /pokemons/types should return all distinct types', async () => {
    const res = await request(app.getHttpServer())
      .get('/pokemons/types')
      .expect(200);
    // Expect at least the types 'Grass', 'Poison', and 'Fire' from our seeded data.
    expect(res.body).toEqual(
      expect.arrayContaining(['Grass', 'Poison', 'Fire']),
    );
  });
});
