import { Injectable } from '@angular/core';
import { Tween } from '@tweenjs/tween.js';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root',
})
export class TweenService {
  constructor() {}

  animateCameraToPosition(
    camera: THREE.PerspectiveCamera,
    targetPosition: THREE.Vector3,
    targetLookAt: THREE.Vector3,
    duration: number = 2000
  ): void {
    // Create a Vector3 to animate for lookAt
    const distance = 100; // Choose an appropriate distance based on your scene
    const currentLookAt = new THREE.Vector3();
    camera.getWorldDirection(currentLookAt);
    currentLookAt.multiplyScalar(distance).add(camera.position);

    // Start a new tween that modifies the camera's position
    const cameraPosAnimation = new Tween(camera.position)
      .to(targetPosition, duration)
      .onUpdate(() => camera.updateProjectionMatrix()); // You might need to update the camera's projection matrix on each frame

    const cameraLookAtAnimation = new Tween(currentLookAt)
      .to(targetLookAt, duration)
      .onUpdate(() => camera.lookAt(currentLookAt));

    // Start the animation loop
    animate();

    function animate() {
      requestAnimationFrame(animate);
      cameraPosAnimation.update();
      cameraLookAtAnimation.update();
    }

    cameraLookAtAnimation.start();
    cameraPosAnimation.start();
  }
}
