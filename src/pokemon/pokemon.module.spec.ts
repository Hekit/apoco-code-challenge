import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Type } from '@nestjs/common';
import { MODULE_METADATA } from '@nestjs/common/constants';
import 'reflect-metadata';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { PokemonModule } from './pokemon.module';
import { PokemonEntity } from '../schemas/pokemon.schema';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';

describe('PokemonModule', () => {
  let moduleRef: TestingModule;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      controllers: [PokemonController],
      providers: [
        PokemonService,
        { provide: getModelToken(PokemonEntity.name), useValue: {} },
        { provide: UserService, useValue: {} },
      ],
    }).compile();
  });

  it('should compile the module', () => {
    expect(moduleRef).toBeDefined();
  });

  it('should provide PokemonService', () => {
    const service = moduleRef.get<PokemonService>(PokemonService);
    expect(service).toBeDefined();
  });

  it('should provide PokemonController', () => {
    const controller = moduleRef.get(PokemonController);
    expect(controller).toBeDefined();
  });
});

describe('PokemonModule Metadata', () => {
  it('should have the correct controllers', () => {
    const controllers =
      (Reflect.getMetadata(
        MODULE_METADATA.CONTROLLERS,
        PokemonModule,
      ) as Type<any>[]) || [];
    expect(controllers).toContain(PokemonController);
  });

  it('should have the correct providers', () => {
    const providers =
      (Reflect.getMetadata(
        MODULE_METADATA.PROVIDERS,
        PokemonModule,
      ) as Type<any>[]) || [];
    expect(providers).toContain(PokemonService);
  });

  it('should have the correct imports', () => {
    const imports =
      (Reflect.getMetadata(MODULE_METADATA.IMPORTS, PokemonModule) as any[]) ||
      [];
    expect(imports.some((imp) => imp === UserModule)).toBe(true);
  });
});
