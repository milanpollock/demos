import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { concatMap, from, map, Observable, of } from 'rxjs';
import { drive_v3 } from 'googleapis';
import { Model } from 'mongoose';

import {
  DEFAULT_ENTITY_GROUP,
  EntityWithGroupType,
  EntityWithoutGroupType,
  WatermarkedType,
} from '@dark-rush-photography/shared/types';
import {
  findGoogleDriveFolderByName$,
  getEntityTypeFromEntityWithGroupType,
  getEntityTypeFromEntityWithoutGroupType,
} from '@dark-rush-photography/api/util';
import { Document, DocumentModel } from '../schema/document.schema';
import { createEntityForFolder$ } from '../entities/entity-create.functions';
import { ConfigProvider } from './config.provider';

@Injectable()
export class EntityCreateWatermarkedTypeProvider {
  private readonly logger: Logger;

  constructor(
    private readonly configProvider: ConfigProvider,
    @InjectModel(Document.name)
    private readonly entityModel: Model<DocumentModel>
  ) {
    this.logger = new Logger(EntityCreateWatermarkedTypeProvider.name);
  }

  createWatermarkedType$(
    googleDrive: drive_v3.Drive,
    folderName: string,
    entityWithoutGroupType: EntityWithoutGroupType,
    watermarkedType: WatermarkedType,
    initialSlug?: string
  ): Observable<void> {
    return from(
      findGoogleDriveFolderByName$(
        googleDrive,
        folderName,
        this.configProvider.getGoogleDriveWebsitesFolderId(watermarkedType)
      )
    ).pipe(
      concatMap((folder) => {
        if (!folder) return of(undefined);

        return createEntityForFolder$(
          googleDrive,
          folder.id,
          this.entityModel,
          getEntityTypeFromEntityWithoutGroupType(entityWithoutGroupType),
          watermarkedType,
          DEFAULT_ENTITY_GROUP,
          initialSlug
        );
      }),
      map(() => undefined)
    );
  }

  createWatermarkedTypeForGroup$(
    googleDrive: drive_v3.Drive,
    folderName: string,
    entityWithGroupType: EntityWithGroupType,
    watermarkedType: WatermarkedType,
    group: string
  ): Observable<void> {
    return from(
      findGoogleDriveFolderByName$(
        googleDrive,
        folderName,
        this.configProvider.getGoogleDriveWebsitesFolderId(watermarkedType)
      )
    ).pipe(
      concatMap((folder) => {
        if (!folder) return of(undefined);

        return findGoogleDriveFolderByName$(googleDrive, group, folder.id).pipe(
          concatMap((groupFolder) => {
            if (!groupFolder) return of(undefined);

            return createEntityForFolder$(
              googleDrive,
              groupFolder.id,
              this.entityModel,
              getEntityTypeFromEntityWithGroupType(entityWithGroupType),
              watermarkedType,
              group
            );
          })
        );
      }),
      map(() => undefined)
    );
  }
}
