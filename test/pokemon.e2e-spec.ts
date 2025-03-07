import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Server } from 'net';
import { AppModule } from '../src/app.module';
import { Pokemon } from '../src/pokemon/pokemon.interface';

describe('PokemonController (e2e)', () => {
  let app: INestApplication<Server>;
  const authHeader = 'Bearer user:password';

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

  it('GET /pokemons/id/:id should return a pokemon if it exists', async () => {
    await request(app.getHttpServer())
      .get(`/pokemons/id/1`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('name', 'Bulbasaur');
      });
  });

  it('GET /pokemons/id/:id should return 404 for non-existent pokemon', async () => {
    await request(app.getHttpServer()).get('/pokemons/id/999').expect(404);
  });

  it('GET /pokemons/name/:name should return a pokemon if it is found', async () => {
    await request(app.getHttpServer())
      .get('/pokemons/name/bulbasaur')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('name', 'Bulbasaur');
      });
  });

  it('GET /pokemons should fail without authentication', async () => {
    const res = await request(app.getHttpServer()).get('/pokemons').expect(401);
    expect(res.unauthorized).toBeTruthy();
  });

  it('GET /pokemons should fail with incorrect password', async () => {
    const res = await request(app.getHttpServer())
      .get('/pokemons')
      .set('Authorization', 'Bearer user:wrongpassword')
      .expect(401);
    expect(res.unauthorized).toBeTruthy();
  });

  it('GET /pokemons?page=1&limit=10 should return a paginated list', async () => {
    const res = await request(app.getHttpServer())
      .get('/pokemons?page=1&limit=10')
      .set('Authorization', authHeader)
      .expect(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it('GET /pokemons?name=bulb should return filtered results by name', async () => {
    const res = await request(app.getHttpServer())
      .get('/pokemons?name=bulb')
      .set('Authorization', authHeader)
      .expect(200);
    (res.body as Pokemon[]).forEach((pokemon: Pokemon) => {
      expect(pokemon.name.toLowerCase()).toContain('bulb');
    });
  });

  it('GET /pokemons?type=Grass,Poison should return pokemons matching either type', async () => {
    const res = await request(app.getHttpServer())
      .get('/pokemons?type=Grass,Poison')
      .set('Authorization', authHeader)
      .expect(200);
    (res.body as Pokemon[]).forEach((pokemon: Pokemon) => {
      // Check that at least one type is in the allowed list.
      const types: string[] = pokemon.types;
      expect(types.includes('Grass') || types.includes('Poison')).toBe(true);
    });
  });

  it('GET /pokemons?favoritesOnly=true should return only favorite pokemons of authenticated user', async () => {
    const res = await request(app.getHttpServer())
      .get('/pokemons?favoritesOnly=true')
      .set('Authorization', authHeader)
      .expect(200);
    const favorites = [1, 2, 3];
    const pokemons = res.body as Pokemon[];
    expect(favorites.length >= pokemons.length).toBe(true);
    pokemons.forEach((pokemon) => {
      expect([1, 2, 3].includes(pokemon._id)).toBe(true);
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
