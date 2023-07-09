import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Building } from 'src/app/models/building.model';
import { Site } from 'src/app/models/site.model';
import { SiteService } from 'src/app/services/site/site.service';
import { ThreejsService } from 'src/app/services/three-js/three-js.service';

@Component({
  selector: 'app-site-view',
  templateUrl: './site-view.component.html',
  styleUrls: ['./site-view.component.scss'],
})
export class SiteViewComponent implements AfterViewInit {
  constructor(
    public siteService: SiteService,
    private threejs: ThreejsService
  ) {}

  @ViewChild('canvas') canvasRef: any;

  ngOnInit(): void {
    this.siteService.getSite().subscribe((site) => {
      this.displaySite(site);
    });
  }

  ngAfterViewInit(): void {
    this.threejs.createScene(this.canvasRef.nativeElement);
    this.threejs.createHemisphereLight();
    this.threejs.animate();
  }

  displaySite(site: Site) {
    this.threejs.addCube(site.widthX, 1, site.widthZ, 0, 0, 0, '#6F6F6F');
    site.buildings.forEach((building) => this.displayBuilding(building));
    this.threejs.createDaylight();
  }

  displayBuilding(building: Building) {
    this.threejs.addCube(
      building.widthX,
      building.heightY,
      building.widthZ,
      building.originX,
      building.heightY / 2,
      building.originZ,
      '#0166B1'
    );

    this.threejs.createText(
      building.name,
      building.originX - building.widthX / 2 + 1,
      building.heightY - 1.9,
      building.originZ + building.widthZ / 2 - 1
    );
  }
}
