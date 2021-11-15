import { Logger } from '@nestjs/common';

import {
  DEFAULT_ENTITY_GROUP,
  EntityType,
} from '@dark-rush-photography/shared/types';

export const logCreatingEntityMessage = (
  logger: Logger,
  folderName: string,
  entityType: EntityType,
  group: string,
  slug?: string
): void => {
  logger.log(
    `Creating ${entityType} entity ${
      group !== DEFAULT_ENTITY_GROUP ? `${group} ` : ''
    }${slug ?? folderName}`
  );
};

export const logFoundEntityMessage = (
  logger: Logger,
  folderName: string,
  entityType: EntityType,
  group: string,
  slug?: string
): void => {
  return logger.log(
    `Found ${entityType} entity ${
      group !== DEFAULT_ENTITY_GROUP ? `${group} ` : ''
    }${slug ?? folderName}`
  );
};