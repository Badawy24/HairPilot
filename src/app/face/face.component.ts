import { Component, ElementRef, ViewChild, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderpageComponent } from '../headerpage/headerpage.component';
import * as faceapi from 'face-api.js';

@Component({
  selector: 'app-face',
  standalone: true,
  imports: [RouterLink, CommonModule, HeaderpageComponent],
  templateUrl: './face.component.html',
  styleUrl: './face.component.css'
})
export class FaceComponent {
  @Input() showHeader = true;

  suggestion = '';
  inputImageSrc = '';
  haircutImages: string[] = [];

  @ViewChild('inputImage', { static: false }) inputImageRef!: ElementRef<HTMLImageElement>;
  @ViewChild('overlayCanvas', { static: false }) overlayCanvasRef!: ElementRef<HTMLCanvasElement>;

  constructor() {
    this.loadModels();
  }

  async loadModels() {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('assets/models/tiny_face_detector'),
      faceapi.nets.faceLandmark68Net.loadFromUri('assets/models/face_landmark_68')
    ]);
  }

  onFileSelected(event: Event) {
    let file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.inputImageSrc = URL.createObjectURL(file);
      setTimeout(() => this.processImage(), 100);
    }
  }

  async processImage() {
    if (!this.inputImageRef || !this.overlayCanvasRef) return;
  
    let img = this.inputImageRef.nativeElement;
    let canvas = this.overlayCanvasRef.nativeElement;
  
    canvas.width = img.width;
    canvas.height = img.height;
  
    let detection = await faceapi
      .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks();
  
    if (!detection) {
      this.suggestion = 'No face detected.';
      this.haircutImages = [];
      return;
    }
  
    let shape = this.getFaceShape(detection.landmarks);
    this.suggestion = `Face Shape: ${shape}\n${this.suggestHaircut(shape)}`;
    this.haircutImages = shape !== 'Unknown' ? this.getHaircutImages(shape) : [];
  
    let displaySize = { width: img.width, height: img.height };
    faceapi.matchDimensions(canvas, displaySize);
  
    let resized = faceapi.resizeResults(detection, displaySize);
  
    let context = canvas.getContext('2d');
    if (context) context.clearRect(0, 0, canvas.width, canvas.height);
  
    faceapi.draw.drawFaceLandmarks(canvas, resized);
    faceapi.draw.drawDetections(canvas, resized);
  }
  

  getFaceShape(landmarks: faceapi.FaceLandmarks68) {
    let jaw = landmarks.getJawOutline();
    let leftJaw = jaw[0];
    let rightJaw = jaw[16];
    let chin = jaw[8];

    let leftCheekbone = landmarks.positions[1];
    let rightCheekbone = landmarks.positions[15];
    let leftForehead = landmarks.positions[19];
    let rightForehead = landmarks.positions[24];

    let foreheadWidth = this.euclidean(leftForehead, rightForehead);
    let cheekboneWidth = this.euclidean(leftCheekbone, rightCheekbone);
    let jawWidth = this.euclidean(leftJaw, rightJaw);
    let faceHeight = this.euclidean(
      { x: (leftForehead.x + rightForehead.x) / 2, y: (leftForehead.y + rightForehead.y) / 2 },
      chin
    );

    let ratio = foreheadWidth / faceHeight;

    if (Math.abs(jawWidth - cheekboneWidth) < 15 && Math.abs(foreheadWidth - cheekboneWidth) < 15) return 'Square';
    if (cheekboneWidth > foreheadWidth && cheekboneWidth > jawWidth) return 'Diamond';
    if (foreheadWidth > cheekboneWidth && foreheadWidth > jawWidth) return 'Heart';
    if (ratio < 0.75) return 'Oblong';
    if (ratio >= 0.75 && ratio <= 0.95) return 'Oval';
    if (ratio > 0.95) return 'Round';
    return 'Unknown';
  }

  euclidean(p1: { x: number; y: number }, p2: { x: number; y: number }) {
    return Math.hypot(p1.x - p2.x, p1.y - p2.y);
  }

  suggestHaircut(faceShape: string) {
    switch (faceShape) {
      case 'Round': return 'Suggested: Pompadour - Quiff - Faux Hawk.';
      case 'Square': return 'Suggested: Buzz Cut - Crew Cut - Side Part.';
      case 'Oval': return 'Suggested: Almost any style suits you! Try Slick Back or Comb Over.';
      case 'Oblong': return 'Suggested: Fringe - Caesar Cut - Medium Textured.';
      case 'Diamond': return 'Suggested: Fringe - Textured Crop - Messy Top.';
      case 'Heart': return 'Suggested: Side Part - Textured Fringe - Taper Fade.';
      default: return 'No suggestion available.';
    }
  }

  getHaircutImages(faceShape: string) {
    let images: string[] = [];
    for (let i = 1; i <= 3; i++) {
      images.push(`assets/result/${faceShape}/${faceShape[0].toLowerCase()}${i}.jpg`);
    }
    return images;
  }
}
