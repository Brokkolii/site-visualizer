import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { Site } from 'src/app/models/site.model';
import { HttpClient } from '@angular/common/http';
import { ThreejsService } from '../three-js/three-js.service';
import { Building } from 'src/app/models/building.model';
import { Mesh, Object3D } from 'three';

@Injectable({
  providedIn: 'root',
})
export class SiteService {
  constructor(private http: HttpClient, private threejs: ThreejsService) {}

  public getSite(): Observable<Site> {
    return this.http.get<Site>('/assets/exampleSite.json');
  }

  public loadSiteToScene(
    site: Site,
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer
  ) {
    this.threejs.createHemisphereLight(scene);
    this.threejs.createDaylight(scene);
    this.displaySite(site, scene);
    this.cameraToDefaultPosition(camera);
    this.addClickEventToBuildings(renderer, scene, camera);
  }

  public addClickEventToBuildings(
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera
  ) {
    this.threejs.addClickListener(renderer, camera, scene, (intersect) => {
      console.log(intersect);
      console.log(intersect.object.userData['id']);
      const object = intersect.object;
      this.zoomToBuilding(object, camera);
    });
  }

  private cameraToDefaultPosition(camera: THREE.PerspectiveCamera) {
    camera.position.set(0, 70, 0);
    camera.lookAt(0, 0, 0);
  }

  private zoomToBuilding(building: Object3D, camera: THREE.PerspectiveCamera) {
    console.log(building);
    camera.position.set(
      building.position.x + 5,
      building.position.y + 10,
      building.position.z + 20
    );
    camera.lookAt(
      building.position.x,
      building.position.y,
      building.position.z
    );
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
      '#6F6F6F',
      site.id
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
      '#0166B1',
      building.id
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
