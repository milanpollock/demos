/* eslint-disable @typescript-eslint/no-explicit-any */
import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';

import * as faker from 'faker';
import { of } from 'rxjs';

import {
  EntityMinimalAdmin,
  EntityType,
  EntityWithGroupType,
  EntityWithoutGroupType,
} from '@dark-rush-photography/shared/types';
import { Document, DocumentModel } from '../schema/document.schema';
import { EntityFindProvider } from './entity-find.provider';

jest.mock('@dark-rush-photography/api/util', () => ({
  ...jest.requireActual('@dark-rush-photography/api/util'),
}));
import * as apiUtil from '@dark-rush-photography/api/util';

jest.mock('../entities/entity-repository.functions', () => ({
  ...jest.requireActual('../entities/entity-repository.functions'),
}));
import * as entityRepositoryFunctions from '../entities/entity-repository.functions';

jest.mock('../entities/entity-load-admin.functions', () => ({
  ...jest.requireActual('../entities/entity-load-admin.functions'),
}));
import * as entityLoadAddFunctions from '../entities/entity-load-admin.functions';

describe('entity-find.provider', () => {
  let entityFindProvider: EntityFindProvider;

  beforeEach(async () => {
    class MockDocumentModel {}

    const moduleRef = await Test.createTestingModule({
      providers: [
        ConfigService,
        {
          provide: getModelToken(Document.name),
          useValue: new MockDocumentModel(),
        },
        EntityFindProvider,
      ],
    }).compile();

    entityFindProvider = moduleRef.get<EntityFindProvider>(EntityFindProvider);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll$', () => {
    beforeEach(() => {
      jest
        .spyOn(apiUtil, 'getEntityTypeFromEntityWithoutGroupType')
        .mockReturnValue(faker.random.arrayElement(Object.values(EntityType)));
    });

    it('should find watermarked and without watermark entities', (done: any) => {
      const watermarkedEntity = {
        slug: faker.lorem.word(),
      } as DocumentModel;
      const withoutWatermarkEntity = {
        slug: faker.lorem.word(),
      } as DocumentModel;

      jest
        .spyOn(entityRepositoryFunctions, 'findAllEntities$')
        .mockReturnValueOnce(of([watermarkedEntity]))
        .mockReturnValueOnce(of([withoutWatermarkEntity]));

      jest
        .spyOn(entityLoadAddFunctions, 'loadEntityMinimalAdmin')
        .mockImplementation(
          (documentModel: DocumentModel) =>
            ({ slug: documentModel.slug } as EntityMinimalAdmin)
        );

      entityFindProvider
        .findAll$(
          faker.random.arrayElement(Object.values(EntityWithoutGroupType))
        )
        .subscribe((result) => {
          expect(result).toEqual([
            { ...watermarkedEntity },
            { ...withoutWatermarkEntity },
          ]);
          done();
        });
    });

    it('should be empty if entities are not found', (done: any) => {
      jest
        .spyOn(entityRepositoryFunctions, 'findAllEntities$')
        .mockReturnValue(of([]));

      const mockedLoadEntityMinimalAdmin = jest.spyOn(
        entityLoadAddFunctions,
        'loadEntityMinimalAdmin'
      );

      entityFindProvider
        .findAll$(
          faker.random.arrayElement(Object.values(EntityWithoutGroupType))
        )
        .subscribe((result) => {
          expect(result).toHaveLength(0);
          expect(mockedLoadEntityMinimalAdmin).not.toBeCalled();
          done();
        });
    });
  });

  describe('findAllForGroup$', () => {
    beforeEach(() => {
      jest
        .spyOn(apiUtil, 'getEntityTypeFromEntityWithGroupType')
        .mockReturnValue(faker.random.arrayElement(Object.values(EntityType)));
    });

    it('should find watermarked and without watermark entities for a group', (done: any) => {
      const watermarkedEntity = {
        slug: faker.lorem.word(),
      } as DocumentModel;
      const withoutWatermarkEntity = {
        slug: faker.lorem.word(),
      } as DocumentModel;

      jest
        .spyOn(entityRepositoryFunctions, 'findAllEntitiesForGroup$')
        .mockReturnValueOnce(of([watermarkedEntity]))
        .mockReturnValueOnce(of([withoutWatermarkEntity]));

      jest
        .spyOn(entityLoadAddFunctions, 'loadEntityMinimalAdmin')
        .mockImplementation(
          (documentModel: DocumentModel) =>
            ({ slug: documentModel.slug } as EntityMinimalAdmin)
        );

      entityFindProvider
        .findAllForGroup$(
          faker.random.arrayElement(Object.values(EntityWithGroupType)),
          faker.lorem.word()
        )
        .subscribe((result) => {
          expect(result).toEqual([
            { ...watermarkedEntity },
            { ...withoutWatermarkEntity },
          ]);
          done();
        });
    });

    it('should be empty if entities are not found for a group', (done: any) => {
      jest
        .spyOn(entityRepositoryFunctions, 'findAllEntitiesForGroup$')
        .mockReturnValue(of([]));

      const mockedLoadEntityMinimalAdmin = jest.spyOn(
        entityLoadAddFunctions,
        'loadEntityMinimalAdmin'
      );

      entityFindProvider
        .findAllForGroup$(
          faker.random.arrayElement(Object.values(EntityWithGroupType)),
          faker.lorem.word()
        )
        .subscribe((result) => {
          expect(result).toHaveLength(0);
          expect(mockedLoadEntityMinimalAdmin).not.toBeCalled();
          done();
        });
    });
  });
});
