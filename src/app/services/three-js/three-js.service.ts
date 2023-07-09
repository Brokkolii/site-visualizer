import { ElementRef, Injectable } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

@Injectable({
  providedIn: 'root',
})
export class ThreejsService {
  scene: THREE.Scene = new THREE.Scene();
  camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera();
  renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();
  controls: OrbitControls = new OrbitControls(
    this.camera,
    this.renderer.domElement
  );

  constructor() {}

  createScene(canvas: HTMLCanvasElement) {
    // Create a scene
    this.scene = new THREE.Scene();

    // Create a camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 70, 0);
    //this.camera.position.set(-50, 50, 50);
    this.camera.lookAt(0, 0, 0);

    // Create a WebGLRenderer and set its width and height
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
    });
    this.renderer.setClearColor('#FFFFFF', 0);
    this.renderer.shadowMap.enabled = true;
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableRotate = false;
    this.controls.enableRotate = true;
    //this.controls.enableZoom = true;
    this.controls.enablePan = true;
    //this.controls.maxPolarAngle = 0;
    //this.controls.minPolarAngle = 0;
    this.controls.mouseButtons = {
      LEFT: THREE.MOUSE.PAN,
      MIDDLE: THREE.MOUSE.ROTATE,
      RIGHT: THREE.MOUSE.DOLLY,
    };
  }

  addCube(
    width = 100,
    height = 100,
    depth = 100,
    x = 0,
    y = 0,
    z = 0,
    color = 'green'
  ) {
    // Create a geometry
    const geometry = new THREE.BoxGeometry(width, height, depth);

    // Create a material
    const material = new THREE.MeshPhongMaterial({
      color: color,
    });

    // Create a mesh using the geometry and material
    const cube = new THREE.Mesh(geometry, material);
    cube.position.x = x;
    cube.position.y = y;
    cube.position.z = z;

    cube.castShadow = true;
    cube.receiveShadow = true;

    //create EdgesGeometry
    const edges = new THREE.EdgesGeometry(geometry);
    const line = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({ color: 0xffffff })
    );
    line.position.x = x;
    line.position.y = y;
    line.position.z = z;

    // Add the cube to the scene
    this.scene.add(cube);
    this.scene.add(line);
  }

  animate() {
    // Create the animation loop
    requestAnimationFrame(this.animate.bind(this));
    // Render the scene with the camera
    this.renderer.render(this.scene, this.camera);
  }

  createHemisphereLight() {
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x0000ff, 1);
    hemiLight.position.set(0, 50, 0);
    this.scene.add(hemiLight);
  }

  createDaylight() {
    const dirLight = new THREE.DirectionalLight(0xffccaa, 1.5);
    dirLight.position.set(25, 50, 50);
    dirLight.target.position.set(0, 0, 0);

    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024; // increase shadow map resolution
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.left = -100; // adjust shadow camera frustum to fit your scene
    dirLight.shadow.camera.right = 100;
    dirLight.shadow.camera.top = 100;
    dirLight.shadow.camera.bottom = -100;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 500;

    dirLight.shadow.bias = -0.0001; // Prevents shadow acne
    dirLight.shadow.radius = 3; // Makes the edges of the shadow softer

    this.scene.add(dirLight);
  }

  createText(text: string, x = 0, y = 0, z = 0) {
    const loader = new FontLoader();
    const scene = this.scene;
    const camera = this.camera;

    loader.load('assets/Roboto_Regular.json', function (font) {
      const geometry = new TextGeometry(text, {
        font: font,
        size: 2,
        height: 2,
        curveSegments: 12,
        bevelEnabled: false,
        depth: 5,
      });

      // Create a material
      const material = new THREE.MeshPhongMaterial({
        color: 'white',
      });

      // Create a mesh using the geometry and material
      const textMesh = new THREE.Mesh(geometry, material);
      textMesh.position.x = x;
      textMesh.position.y = y;
      textMesh.position.z = z;
      textMesh.lookAt(x, y + 100, z);
      scene.add(textMesh);
    });
  }
}
