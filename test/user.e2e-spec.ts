// test/app.e2e-spec.ts
import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Server } from 'net';
import { AppModule } from '../src/app.module';
import { UserDocument, UserEntity } from '../src/schemas/user.schema';
import { User, UserFavoritesResponse } from 'src/user/user.interface';

describe('UserController (e2e)', () => {
  let app: INestApplication<Server>;

  // Test constants for a mock user
  const MOCK_USER_ID = 9999999;
  const MOCK_USER_USERNAME = 'testuser';
  const MOCK_USER_PASSWORD = 'password123';
  const MOCK_USER_AUTH_HEADER = `Bearer ${MOCK_USER_USERNAME}:${MOCK_USER_PASSWORD}`;

  // A mock user object
  const mockUser: User = {
    _id: MOCK_USER_ID,
    username: MOCK_USER_USERNAME,
    password: MOCK_USER_PASSWORD,
    favorites: [],
  };

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Ensure the test user does not exist before tests run
    const userModel = app.get<Model<UserDocument>>(
      getModelToken(UserEntity.name),
    );
    await userModel.deleteOne({ username: MOCK_USER_USERNAME }).exec();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /users should create a new user', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .send(mockUser)
      .expect(201);
    const body = response.body as User;
    expect(body.username).toEqual(MOCK_USER_USERNAME);
  });

  it(`GET /users/favorites should get authenticated user's favorites`, async () => {
    const response = await request(app.getHttpServer())
      .get(`/users/favorites`)
      .set('Authorization', MOCK_USER_AUTH_HEADER)
      .expect(200);
    // Initially, favorites should be an empty array
    const body = response.body as UserFavoritesResponse;
    expect(body).toEqual([]);
  });

  it(`PATCH /users/favorites/${MOCK_USER_ID} should toggle favorite`, async () => {
    // Toggle to add a favorite (e.g. 5)
    const addResponse = await request(app.getHttpServer())
      .patch(`/users/favorites/5`)
      .set('Authorization', MOCK_USER_AUTH_HEADER)
      .expect(200);
    expect((addResponse.body as UserFavoritesResponse).favorites).toContain(5);

    // Toggle again to remove the favorite
    const removeResponse = await request(app.getHttpServer())
      .patch(`/users/favorites/5`)
      .set('Authorization', MOCK_USER_AUTH_HEADER)
      .expect(200);
    expect(
      (removeResponse.body as UserFavoritesResponse).favorites,
    ).not.toContain(5);
  });
});
