import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { Site } from 'src/app/models/site.model';
import { HttpClient } from '@angular/common/http';
import { ThreejsService } from '../three-js/three-js.service';
import { Building } from 'src/app/models/building.model';

@Injectable({
  providedIn: 'root',
})
export class SiteService {
  constructor(private http: HttpClient, private threejs: ThreejsService) {}

  public getSite(): Observable<Site> {
    return this.http.get<Site>('/assets/exampleSite.json');
  }

  public loadSiteToScene(site: Site, scene: THREE.Scene) {
    this.threejs.createHemisphereLight(scene);
    this.threejs.createDaylight(scene);
    this.displaySite(site, scene);
  }

  private displaySite(site: Site, scene: THREE.Scene) {
    this.threejs.addCube(
      scene,
      site.widthX,
      1,
      site.widthZ,
      0,
      0,
      0,
      '#6F6F6F'
    );

    site.buildings.forEach((building) => this.displayBuilding(building, scene));
  }

  private displayBuilding(building: Building, scene: THREE.Scene) {
    this.threejs.addCube(
      scene,
      building.widthX,
      building.heightY,
      building.widthZ,
      building.originX,
      building.heightY / 2,
      building.originZ,
      '#0166B1'
    );
    this.displayBuildingName(building, scene);
  }

  private displayBuildingName(building: Building, scene: THREE.Scene) {
    this.threejs.createText(
      scene,
      building.name,
      [
        building.originX - building.widthX / 2 + 1,
        building.heightY - 1.9,
        building.originZ + building.widthZ / 2 - 1,
      ],
      [
        building.originX - building.widthX / 2 + 1,
        building.heightY - +1,
        building.originZ + building.widthZ / 2 - 1,
      ]
    );
  }
}
