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
      0.01,
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

    /*
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
    */
    const controls = new OrbitControls(
      camera,
      document.createElement('canvas')
    );

    return { scene, camera, renderer, controls };
  }

  addCube(
    parent: THREE.Mesh | THREE.Scene,
    width = 100,
    height = 100,
    depth = 100,
    x = 0,
    y = 0,
    z = 0,
    color = 'green',
    id?: string,
    type?: string
  ) {
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshPhongMaterial({
      color: color,
    });

    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(x, y, z);

    cube.castShadow = true;
    cube.receiveShadow = true;

    cube.userData = { id, type };

    // Add the cube to the scene
    parent.add(cube);
    return cube;
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
    parent: THREE.Mesh | THREE.Scene,
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
      parent.add(textMesh);
    });
  }

  addClickListener(
    renderer: THREE.WebGLRenderer,
    camera: THREE.PerspectiveCamera,
    scene: THREE.Scene,
    onClick: (intersect: THREE.Intersection | null) => void
  ): void {
    // Create a Raycaster instance
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Listen for click events
    renderer.domElement.addEventListener(
      'click',
      (event) => {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        // Set the Raycaster to shoot from the camera's position through the mouse's position
        raycaster.setFromCamera(mouse, camera);

        // Check for intersection with any object in the scene
        const intersects = raycaster.intersectObjects(scene.children, false);

        // If no ArrowHelper exists, create one
        if (false) {
          const arrowHelper = new THREE.ArrowHelper(
            raycaster.ray.direction,
            raycaster.ray.origin,
            1000,
            0xff0000
          );
          scene.add(arrowHelper);
        }

        // If there's an intersection, execute the callback
        if (intersects.length > 0) {
          onClick(intersects[0]);
        } else {
          onClick(null);
        }
      },
      false
    );
  }
}
