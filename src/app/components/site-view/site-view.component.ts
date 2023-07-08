import { Component, OnInit } from '@angular/core';
import { Site } from 'src/app/models/site.model';
import { SiteService } from 'src/app/services/site/site.service';

@Component({
  selector: 'app-site-view',
  templateUrl: './site-view.component.html',
  styleUrls: ['./site-view.component.scss'],
})
export class SiteViewComponent {
  constructor(public siteService: SiteService) {}

  site$ = this.siteService.getSite();
}
