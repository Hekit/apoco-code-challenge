import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Type } from '@nestjs/common';
import { MODULE_METADATA } from '@nestjs/common/constants';
import 'reflect-metadata';
import { UserService } from './user.service';
import { UserModule } from './user.module';
import { UserController } from './user.controller';
import { UserEntity } from '../schemas/user.schema';

describe('UserModule', () => {
  let moduleRef: TestingModule;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        { provide: getModelToken(UserEntity.name), useValue: {} },
      ],
    }).compile();
  });

  it('should compile the module', () => {
    expect(moduleRef).toBeDefined();
  });

  it('should provide UserService', () => {
    const service = moduleRef.get<UserService>(UserService);
    expect(service).toBeDefined();
  });

  it('should provide UserController', () => {
    const controller = moduleRef.get(UserController);
    expect(controller).toBeDefined();
  });
});

describe('UserModule Metadata', () => {
  it('should have the correct controllers', () => {
    const controllers =
      (Reflect.getMetadata(
        MODULE_METADATA.CONTROLLERS,
        UserModule,
      ) as Type<any>[]) || [];
    expect(controllers).toContain(UserController);
  });

  it('should have the correct providers', () => {
    const providers =
      (Reflect.getMetadata(
        MODULE_METADATA.PROVIDERS,
        UserModule,
      ) as Type<any>[]) || [];
    expect(providers).toContain(UserService);
  });

  it('should have the correct imports', () => {
    const exports =
      (Reflect.getMetadata(MODULE_METADATA.EXPORTS, UserModule) as any[]) || [];
    expect(exports.some((exp) => exp === UserService)).toBe(true);
  });
});
