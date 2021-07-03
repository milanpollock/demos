import { HttpService, Logger } from '@nestjs/common';

import { from, Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';

import { EntityType } from '@dark-rush-photography/shared/types';
import { EnvServerless } from '@dark-rush-photography/api/types';

export const serverlessMediaProcess$ = (
  envServerless: EnvServerless,
  httpService: HttpService,
  entityType: EntityType,
  entityId: string
): Observable<unknown> => {
  const url = `${envServerless.url}/media-process`;
  Logger.log(url, serverlessMediaProcess$.name);
  return from(
    httpService
      .post(
        url,
        {
          entityType,
          entityId,
        },
        {
          headers: {
            'x-functions-key': envServerless.functionsKey,
          },
        }
      )
      .pipe(map((axiosResponse) => axiosResponse.data))
  );
};