import { EventDto } from '@dark-rush-photography/api/types';

export class SparkleSandySprings2018 extends EventDto {
  slug = 'sparkle-sandy-springs-2018';
  group = 2018;
  title = 'Sandy Springs Festival, 2018';
  description = '';
  keywords = [];
  dateCreated = new Date(2018, 1, 7).toISOString().substring(0, 10);
  datePublished = new Date(2018, 1, 7).toISOString().substring(0, 10);
  location = {
    place: 'Heritage Sandy Springs',
    city: 'Sandy Springs',
    stateOrProvince: 'Georgia',
    country: 'United States',
  };
  useTitleImage = false;

  private constructor() {
    super();
  }

  static of(): EventDto {
    return new SparkleSandySprings2018();
  }
}