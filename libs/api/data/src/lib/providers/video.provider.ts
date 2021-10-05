import { Injectable } from '@nestjs/common';

import { v4 as uuidv4 } from 'uuid';
import { Model } from 'mongoose';
import { concatMap, from, map, Observable } from 'rxjs';

import { Video } from '@dark-rush-photography/shared/types';
import { DocumentModel } from '../schema/document.schema';
import { loadVideo } from '../content/content-load.functions';
import { validateEntityFound } from '../entities/entity-validation.functions';
import { validateVideoFound } from '../content/content-validation.functions';

@Injectable()
export class VideoProvider {
  add$(
    videoId: string,
    entityId: string,
    fileName: string,
    entityModel: Model<DocumentModel>
  ): Observable<Video> {
    return from(entityModel.findById(entityId)).pipe(
      map(validateEntityFound),
      concatMap((documentModel) =>
        from(
          entityModel.findByIdAndUpdate(entityId, {
            videos: [
              ...documentModel.videos,
              {
                id: videoId,
                entityId,
                storageId: uuidv4(),
                fileName,
              },
            ],
          })
        )
      ),
      concatMap(() => this.findOne$(videoId, entityId, entityModel))
    );
  }

  findOne$(
    videoId: string,
    entityId: string,
    entityModel: Model<DocumentModel>
  ): Observable<Video> {
    return from(entityModel.findById(entityId)).pipe(
      map(validateEntityFound),
      map((documentModel) => {
        return loadVideo(validateVideoFound(videoId, documentModel));
      })
    );
  }

  /*



      map(() => undefined)
      //concatMap(([video, documentModel]) =>
      //  this.videoProvider.update$(
      //    video,
      //    {
      //      fileName: `${documentModel.slug}${path.extname(video.fileName)}`,
      //    },
      //    documentModel,
      //    entityModel
      //  )
      //),*/
}
