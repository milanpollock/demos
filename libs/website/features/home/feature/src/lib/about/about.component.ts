import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PageType } from '@dark-rush-photography/website/types';
import { MetaService } from '@dark-rush-photography/website/util';

@Component({
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private metaService: MetaService
  ) {}

  ngOnInit(): void {
    this.metaService.addMetadataForPage(
      PageType.About,
      this.route.snapshot.url.join('/')
    );
  }
}
