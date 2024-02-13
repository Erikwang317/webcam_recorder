import { Component, ElementRef, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import * as THREE from 'three';
import { Sphere } from 'three';

@Component({
  selector: 'app-stars',
  standalone: true,
  imports: [],
  templateUrl: './stars.component.html',
  styleUrl: './stars.component.scss'
})
export class StarsComponent implements AfterViewInit, OnDestroy{
  @ViewChild('rendererContainer', { static: false }) rendererContainer!: ElementRef;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private points!: THREE.Points;

  // ngOnInit(): void {
  //   this.initThree();
  // }

  ngOnDestroy(): void {
    if (this.renderer) this.renderer.dispose();
  }

  ngAfterViewInit(): void {
    this.initThree();
    if (this.rendererContainer) {
      console.log(this.rendererContainer.nativeElement);
    }
  }

  initThree(): void {
    if (!this.rendererContainer) return;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);

    const vertices = [];
    for (let i = 0; i < 1000; i++) {
      const x = THREE.MathUtils.randFloatSpread(2); 
      const y = THREE.MathUtils.randFloatSpread(2);
      const z = THREE.MathUtils.randFloatSpread(2);
      vertices.push(x, y, z);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    const material = new THREE.PointsMaterial({ color: 0xffffff, size: 0.002 });
    this.points = new THREE.Points(geometry, material);
    this.scene.add(this.points);

    this.camera.position.z = 1;

    this.animate();
  }

  animate = () => {
    requestAnimationFrame(this.animate);
    this.points.rotation.x += 0.002;
    this.points.rotation.y += 0.002;
    this.renderer.render(this.scene, this.camera);
  };
}
