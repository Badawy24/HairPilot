import { Injectable } from '@angular/core';
import * as faceapi from 'face-api.js';

@Injectable({
  providedIn: 'root'
})
export class FaceAiService {

  private modelsLoaded = false;
  console.log(7);
  async loadModels() {
    if (this.modelsLoaded) return;
    const MODEL_URL = 'assets/models/';
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

  getFaceShape(landmarks: faceapi.FaceLandmarks68): string {
  const jaw = landmarks.getJawOutline();
  const leftJaw = jaw[0], rightJaw = jaw[16], chin = jaw[8];
  const leftCheekbone = landmarks.positions[1];
  const rightCheekbone = landmarks.positions[15];
  const leftForehead = landmarks.positions[19];
  const rightForehead = landmarks.positions[24];

  const foreheadWidth = this.euclidean(leftForehead, rightForehead);
  const cheekboneWidth = this.euclidean(leftCheekbone, rightCheekbone);
  const jawWidth = this.euclidean(leftJaw, rightJaw);
  const faceHeight = this.euclidean(
    { x: (leftForehead.x + rightForehead.x) / 2, y: (leftForehead.y + rightForehead.y) / 2 },
    chin
  );

  const ratioLengthToCheekbone = faceHeight / cheekboneWidth;
  const ratioForeheadToJaw = foreheadWidth / jawWidth;
  const ratioJawToCheekbone = jawWidth / cheekboneWidth;

  console.log({
    foreheadWidth: foreheadWidth.toFixed(2),
    cheekboneWidth: cheekboneWidth.toFixed(2),
    jawWidth: jawWidth.toFixed(2),
    faceHeight: faceHeight.toFixed(2),
    ratioLengthToCheekbone: ratioLengthToCheekbone.toFixed(2),
    ratioForeheadToJaw: ratioForeheadToJaw.toFixed(2),
    ratioJawToCheekbone: ratioJawToCheekbone.toFixed(2)
  });

  if (ratioLengthToCheekbone > 1.7) return 'Oblong';
  if (ratioForeheadToJaw > 1.2 && foreheadWidth > cheekboneWidth) return 'Heart';
  if (cheekboneWidth > foreheadWidth && cheekboneWidth > jawWidth && ratioLengthToCheekbone >= 1.4 && ratioLengthToCheekbone <= 1.6) return 'Diamond';
  if (Math.abs(jawWidth - cheekboneWidth) < 15 && Math.abs(foreheadWidth - cheekboneWidth) < 15 && ratioLengthToCheekbone >= 1.3 && ratioLengthToCheekbone <= 1.6) return 'Square';
  if (ratioLengthToCheekbone >= 1.4 && ratioLengthToCheekbone <= 1.7) return 'Oval';
  if (ratioLengthToCheekbone < 1.4) return 'Round';

  return 'Unknown';
}





  getSuggestions(shape: string): string {
    switch (shape) {
      case 'Round': return 'Round face: Choose hairstyles that add height to elongate your face.';
      case 'Square': return 'Square face: Go for styles that soften the jawline.';
      case 'Oval': return 'Oval face: Almost any hairstyle works well with this balanced shape.';
      case 'Oblong': return 'Oblong face: Choose styles that add width, like layered or curly cuts.';
      case 'Diamond': return 'Diamond face: Pick styles that add volume at the forehead and chin.';
      case 'Heart': return 'Heart face: Styles that balance a wider forehead with a narrower chin.';
      default: return 'No suggestion available.';
    }
  }

  getHaircutImages(faceShape: string): string[] {
    const images: string[] = [];
    for (let i = 1; i <= 3; i++) {
      images.push(`assets/result/${faceShape}/${faceShape[0].toLowerCase()}${i}.jpg`);
    }
    return images;
  }

  drawDetections(image: HTMLImageElement, canvas: HTMLCanvasElement, detection: any) {
    const displaySize = { width: image.width, height: image.height };
    faceapi.matchDimensions(canvas, displaySize);
    const resized = faceapi.resizeResults(detection, displaySize);

    const context = canvas.getContext('2d');
    if (context) context.clearRect(0, 0, canvas.width, canvas.height);

    faceapi.draw.drawFaceLandmarks(canvas, resized);
    faceapi.draw.drawDetections(canvas, resized);
  }

  private euclidean(p1: { x: number; y: number }, p2: { x: number; y: number }): number {
    return Math.hypot(p1.x - p2.x, p1.y - p2.y);
  }
}
