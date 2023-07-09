import { ElementRef, Injectable } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

@Injectable({
  providedIn: 'root',
})
export class ThreejsService {
  constructor() {}

  createScene(canvas: HTMLCanvasElement) {
    // Create a scene
    const scene = new THREE.Scene();

    // Create a camera
    const camera = new THREE.PerspectiveCamera(
      75,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000
    );

    // Create a WebGLRenderer and set its width and height
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
    });
    renderer.setClearColor('#FFFFFF', 0);
    renderer.shadowMap.enabled = true;
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableRotate = false;
    controls.enableRotate = true;
    //controls.enableZoom = true;
    controls.enablePan = true;
    //controls.maxPolarAngle = 0;
    //controls.minPolarAngle = 0;
    controls.mouseButtons = {
      LEFT: THREE.MOUSE.PAN,
      MIDDLE: THREE.MOUSE.ROTATE,
      RIGHT: THREE.MOUSE.DOLLY,
    };

    return { scene, camera, renderer, controls };
  }

  addCube(
    scene: THREE.Scene,
    width = 100,
    height = 100,
    depth = 100,
    x = 0,
    y = 0,
    z = 0,
    color = 'green',
    id?: string
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

    if (id) {
      cube.userData = { id: id };
    }

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
    scene.add(cube);
    scene.add(line);
  }

  animate = (
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.Camera
  ) => {
    requestAnimationFrame(() => this.animate(renderer, scene, camera));
    renderer.render(scene, camera);
  };

  createHemisphereLight(scene: THREE.Scene) {
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x0000ff, 1);
    hemiLight.position.set(0, 50, 0);
    scene.add(hemiLight);
  }

  createDaylight(scene: THREE.Scene) {
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

    scene.add(dirLight);
  }

  createText(
    scene: THREE.Scene,
    text: string,
    pos = [0, 0, 0],
    lookAt = [0, 0, 0]
  ) {
    const loader = new FontLoader();

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
      textMesh.position.set(pos[0], pos[1], pos[2]);
      textMesh.lookAt(lookAt[0], lookAt[1], lookAt[2]);
      scene.add(textMesh);
    });
  }

  addClickListener(
    renderer: THREE.WebGLRenderer,
    camera: THREE.PerspectiveCamera,
    scene: THREE.Scene,
    onClick: (intersect: THREE.Intersection) => void
  ): void {
    // Create a Raycaster instance
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Listen for click events
    renderer.domElement.addEventListener(
      'click',
      (event) => {
        // Normalize mouse position to [-1, 1]
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Set the Raycaster to shoot from the camera's position through the mouse's position
        raycaster.setFromCamera(mouse, camera);

        // Check for intersection with any object in the scene
        const intersects = raycaster.intersectObjects(scene.children, true);

        // If there's an intersection, execute the callback
        if (intersects.length > 0) {
          onClick(intersects[0]);
        }
      },
      false
    );
  }
}
