import { Component, ElementRef, ViewChild, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderpageComponent } from '../headerpage/headerpage.component';
import { FaceAiService } from '../face-ai.service';

@Component({
  selector: 'app-face',
  standalone: true,
  imports: [RouterLink, CommonModule, HeaderpageComponent],
  templateUrl: './face.component.html',
  styleUrl: './face.component.css'
})
export class FaceComponent {
  @Input() showHeader = true;
  isLoading:boolean = false;
  suggestion = '';
  inputImageSrc = '';
  haircutImages: string[] = [];

  @ViewChild('inputImage', { static: false }) inputImageRef!: ElementRef<HTMLImageElement>;
  @ViewChild('overlayCanvas', { static: false }) overlayCanvasRef!: ElementRef<HTMLCanvasElement>;

  constructor(private faceAiService: FaceAiService) {}

  onFileSelected(event: Event) {
    this.isLoading = true;
    let file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.isLoading = false;
      this.inputImageSrc = URL.createObjectURL(file);
      setTimeout(() => this.processImage(), 100);
    }
  }

  async processImage() {
    if (!this.inputImageRef || !this.overlayCanvasRef) return;

    let img = this.inputImageRef.nativeElement;
    let canvas = this.overlayCanvasRef.nativeElement;

    let detection = await this.faceAiService.detectFace(img);

    if (!detection) {
      this.suggestion = 'No face detected.';
      this.haircutImages = [];
      return;
    }

    let shape = this.faceAiService.getFaceShape(detection.landmarks);
    this.suggestion = `Face Shape: ${shape}`;
    this.haircutImages = shape !== 'Unknown' ? this.faceAiService.getHaircutImages(shape) : [];

    this.faceAiService.drawDetections(img, canvas, detection);
  }
}
