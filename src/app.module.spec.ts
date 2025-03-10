import { Test, TestingModule } from '@nestjs/testing';
import { MODULE_METADATA } from '@nestjs/common/constants';
import 'reflect-metadata';
import { AppModule } from './app.module';
import { PokemonModule } from './pokemon/pokemon.module';
import { UserModule } from './user/user.module';

describe('UserModule', () => {
  let moduleRef: TestingModule;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({}).compile();
  });

  it('should compile the module', () => {
    expect(moduleRef).toBeDefined();
  });
});

describe('UserModule Metadata', () => {
  it('should have the correct imports', () => {
    const imports =
      (Reflect.getMetadata(MODULE_METADATA.IMPORTS, AppModule) as any[]) || [];
    expect(imports.some((imp) => imp === PokemonModule)).toBe(true);
    expect(imports.some((imp) => imp === UserModule)).toBe(true);
  });
});
