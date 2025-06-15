import { Injectable } from '@angular/core';
import * as faceapi from 'face-api.js';

@Injectable({
  providedIn: 'root'
})
export class FaceAiService {

  private modelsLoaded = false;

  async loadModels() {
    if (this.modelsLoaded) return;
    let MODEL_URL = 'assets/models/';
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL + 'tiny_face_detector'),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL + 'face_landmark_68'),
    ]);
    this.modelsLoaded = true;
  }

  async detectFace(image: HTMLImageElement) {
    await this.loadModels();
    return await faceapi.detectSingleFace(image, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();
  }

  getFaceShape(landmarks: faceapi.FaceLandmarks68) {
    let jaw = landmarks.getJawOutline();
    let leftJaw = jaw[0], rightJaw = jaw[16], chin = jaw[8];
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
    if (ratio < 0.65) return 'Oblong';
    if (ratio >= 0.65 && ratio <= 0.85) return 'Oval';
    if (ratio > 0.85) return 'Round';
    return 'Unknown';
  }

  getSuggestions(shape: string): string {
    switch (shape) {
      case 'Round': return 'Round';
      case 'Square': return 'Square';
      case 'Oval': return 'Oval';
      case 'Oblong': return 'Oblong';
      case 'Diamond': return 'Diamond';
      case 'Heart': return 'Heart';
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

  drawDetections(image: HTMLImageElement, canvas: HTMLCanvasElement, detection: any) {
    let displaySize = { width: image.width, height: image.height };
    faceapi.matchDimensions(canvas, displaySize);
    let resized = faceapi.resizeResults(detection, displaySize);

    let context = canvas.getContext('2d');
    if (context) context.clearRect(0, 0, canvas.width, canvas.height);

    faceapi.draw.drawFaceLandmarks(canvas, resized);
    faceapi.draw.drawDetections(canvas, resized);
  }

  private euclidean(p1: { x: number; y: number }, p2: { x: number; y: number }) {
    return Math.hypot(p1.x - p2.x, p1.y - p2.y);
  }
}
