import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Building } from 'src/app/models/building.model';
import { Site } from 'src/app/models/site.model';
import { SiteService } from 'src/app/services/site/site.service';
import { ThreejsService } from 'src/app/services/three-js/three-js.service';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

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

  scene?: THREE.Scene;
  camera?: THREE.PerspectiveCamera;
  renderer?: THREE.WebGLRenderer;
  controls?: OrbitControls;

  ngAfterViewInit(): void {
    this.siteService.getSite().subscribe((site) => {
      ({
        scene: this.scene,
        camera: this.camera,
        renderer: this.renderer,
        controls: this.controls,
      } = this.threejs.createScene(this.canvasRef.nativeElement));
      this.siteService.loadSiteToScene(
        site,
        this.scene,
        this.camera,
        this.renderer
      );
      this.threejs.animate(this.renderer, this.scene, this.camera);
    });
  }
}
