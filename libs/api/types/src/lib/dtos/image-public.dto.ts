import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { ImagePublic } from '@dark-rush-photography/shared/types';
import { DimensionDto } from './dimension.dto';

export class ImagePublicDto implements ImagePublic {
  @IsUUID()
  storageId!: string;

  @IsString()
  slug!: string;

  @IsInt()
  @Min(0)
  order!: number;

  @IsBoolean()
  isThreeSixtyImage!: boolean;

  @IsString()
  @IsOptional()
  threeSixtyImageStorageId?: string;

  @ValidateNested()
  @Type(() => DimensionDto)
  smallDimension!: DimensionDto;
}
