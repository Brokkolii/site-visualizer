import { Injectable } from '@angular/core';
import { Observable, Subject, map, of, tap } from 'rxjs';
import { Site } from 'src/app/models/site.model';
import { HttpClient } from '@angular/common/http';
import { ThreejsService } from '../three-js/three-js.service';
import { Building } from 'src/app/models/building.model';
import { Mesh, Object3D } from 'three';
import { TweenService } from '../tween/tween.service';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root',
})
export class SiteService {
  constructor(
    private http: HttpClient,
    private threejs: ThreejsService,
    private tween: TweenService
  ) {}

  private currentlyInViewSubject = new Subject<Object3D>();
  currentlyInView$ = this.currentlyInViewSubject.asObservable();
  currentlyInViewType$ = this.currentlyInView$.pipe(
    map((object) => {
      if (object.userData['type'] === 'building') {
        return 'building';
      } else if (object.userData['type'] === 'site') {
        return 'site';
      } else {
        return null;
      }
    })
  );

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
    this.cameraToDefaultPosition(camera, scene);
    this.addClickEventToBuildings(renderer, scene, camera);
  }

  public addClickEventToBuildings(
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera
  ) {
    this.threejs.addClickListener(renderer, camera, scene, (intersect) => {
      if (intersect) {
        const object = intersect.object;
        if (object.userData['type'] === 'building') {
          this.zoomToBuilding(object, camera, scene);
        }
      } else {
        this.cameraToDefaultPosition(camera, scene);
      }
    });
  }

  public cameraToDefaultPosition(
    camera: THREE.PerspectiveCamera,
    scene: THREE.Scene
  ) {
    const delay = 700;
    this.tween.animateCameraToPosition(
      camera,
      new THREE.Vector3(0, 70, 0),
      new THREE.Vector3(0, 0, 0),
      delay
    );
    //find an child of the scene with type site and store it in a variable called const site
    const site = scene.children.find((child) => {
      const object = child as Mesh;
      return object.userData['type'] === 'site';
    });
    if (site) {
      this.currentlyInViewSubject.next(site);
    }
    setTimeout(() => {
      this.setOpacityToBuildings(null, scene);
    }, delay);
  }

  private zoomToBuilding(
    building: Object3D,
    camera: THREE.PerspectiveCamera,
    scene: THREE.Scene
  ) {
    const delay = 700;
    const targetPosition = new THREE.Vector3(
      building.position.x,
      building.position.y + 10,
      building.position.z + 20
    );
    const targetLookAtPostion = new THREE.Vector3(
      building.position.x,
      building.position.y,
      building.position.z
    );
    this.tween.animateCameraToPosition(
      camera,
      targetPosition,
      targetLookAtPostion,
      delay
    );
    this.currentlyInViewSubject.next(building);
    setTimeout(() => {
      this.setOpacityToBuildings(building.uuid, scene);
    }, delay);
  }

  private setOpacityToBuildings(targetUuid: string | null, scene: THREE.Scene) {
    scene.children.forEach((child) => {
      const object = child as Mesh;
      if (object.userData['type'] === 'building') {
        const opacity = object.uuid !== targetUuid ? 1 : 0.1;

        //set opacity
        const material = object.material as THREE.MeshPhongMaterial;
        if (material.opacity !== opacity) {
          material.transparent = true;
          material.opacity = opacity;
          material.needsUpdate = true;
        }
        object.children.forEach((child) => {
          const childObject = child as Mesh;
          const childMaterial = childObject.material as THREE.MeshPhongMaterial;
          if (childMaterial.opacity !== opacity) {
            childMaterial.transparent = true;
            childMaterial.opacity = opacity;
            childMaterial.needsUpdate = true;
          }
        });
      }
    });
  }

  private displaySite(site: Site, scene: THREE.Scene) {
    const siteMesh = this.threejs.addCube(
      scene,
      site.widthX,
      1,
      site.widthZ,
      0,
      0,
      0,
      '#6F6F6F',
      site.id,
      'site'
    );

    site.buildings.forEach((building) => this.displayBuilding(building, scene));
  }

  private displayBuilding(building: Building, scene: THREE.Scene) {
    const buildingMesh = this.threejs.addCube(
      scene,
      building.widthX,
      building.heightY,
      building.widthZ,
      building.originX,
      building.heightY / 2,
      building.originZ,
      '#0166B1',
      building.id,
      'building'
    );
    this.displayBuildingName(building, buildingMesh);
  }

  private displayBuildingName(building: Building, buildingMesh: THREE.Mesh) {
    this.threejs.createText(
      buildingMesh,
      building.name,
      [
        (building.widthX / 2) * -1 + 1,
        building.heightY / 2 - 1.9,
        building.widthZ / 2 - 1,
      ],
      [
        (building.widthX / 2) * -1 + 1,
        building.heightY / 2 - 1.9 + 10,
        building.widthZ / 2 - 1,
      ]
    );
  }
}
