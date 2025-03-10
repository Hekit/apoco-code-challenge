import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

describe('CreateUserDto', () => {
  it('should validate a fully populated valid DTO', async () => {
    const payload = {
      _id: 1,
      username: 'testuser',
      password: 'secret',
      favorites: [1, 2, 3],
    };
    const dto = plainToInstance(CreateUserDto, payload);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should allow favorites to be missing', async () => {
    const payload = {
      _id: 1,
      username: 'testuser',
      password: 'secret',
    };
    const dto = plainToInstance(CreateUserDto, payload);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should return errors if required fields are missing', async () => {
    const payload = {};
    const dto = plainToInstance(CreateUserDto, payload);
    const errors = await validate(dto);
    // Expect errors for _id, username, and password
    expect(errors.some((e) => e.property === '_id')).toBeTruthy();
    expect(errors.some((e) => e.property === 'username')).toBeTruthy();
    expect(errors.some((e) => e.property === 'password')).toBeTruthy();
  });

  it('should return an error if _id is not a number', async () => {
    const payload = {
      _id: 'abc', // Invalid type
      username: 'testuser',
      password: 'secret',
    };
    const dto = plainToInstance(CreateUserDto, payload);
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === '_id')).toBeTruthy();
  });

  it('should return an error if username is not a string', async () => {
    const payload = {
      _id: 1,
      username: 123, // Invalid type
      password: 'secret',
    };
    const dto = plainToInstance(CreateUserDto, payload);
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'username')).toBeTruthy();
  });

  it('should return an error if password is not a string', async () => {
    const payload = {
      _id: 1,
      username: 'testuser',
      password: 123, // Invalid type
    };
    const dto = plainToInstance(CreateUserDto, payload);
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'password')).toBeTruthy();
  });

  it('should return an error if favorites is not an array', async () => {
    const payload = {
      _id: 1,
      username: 'testuser',
      password: 'secret',
      favorites: 'not an array', // Invalid type
    };
    const dto = plainToInstance(CreateUserDto, payload);
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'favorites')).toBeTruthy();
  });
});
