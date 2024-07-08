import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { BrowserMultiFormatReader, DecodeHintType } from '@zxing/library';
import { Subscription } from 'rxjs';
import { ModalCodebarreService } from '../modal-codebarre/modal-codebarre.service';

@Component({
  selector: 'app-modal-codebarre-scan-continue',
  templateUrl: './modal-codebarre-scan-continue.component.html',
  styleUrls: ['./modal-codebarre-scan-continue.component.css'],
})
export class ModalCodebarreScanContinueComponent
  implements AfterViewInit, OnDestroy
{
  @ViewChild('video', { static: false }) video!: ElementRef;
  isCameraOpen = false;
  mediaStream: MediaStream | undefined;
  scannerSubscription: Subscription | undefined;

  constructor(private barService: ModalCodebarreService) {}

  ngAfterViewInit(): void {
    // Initially, the camera is not opened. You can call createMediaStream() externally to open it.
  }

  // Make this method public so it can be called from outside
  createMediaStream(): void {
    if (!this.isCameraOpen) {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ video: { facingMode: 'environment' } })
          .then((stream) => {
            this.mediaStream = stream;
            if (this.video && this.video.nativeElement) {
              this.video.nativeElement.srcObject = stream;
              this.isCameraOpen = true;
              this.scanMultipleCodes();
            }
          })
          .catch((err) => {
            console.error('Error accessing camera: ', err);
          });
      }
    }
  }

  scanMultipleCodes(): void {
    const codeReader = new BrowserMultiFormatReader(undefined, 500);
    const hints = new Map<DecodeHintType, any[]>();
    hints.set(DecodeHintType.TRY_HARDER, [true]);
    codeReader.hints = hints;

    codeReader
      .decodeFromInputVideoDevice(undefined, this.video.nativeElement)
      .then((result) => {
        // Handle successful scan
        this.handleScanResult(result.getText());
        this.playBeep();
      })
      .catch((err) => {
        console.error('Error while scanning:', err);
      });
  }

  stopScanner(): void {
    this.isCameraOpen = false;
    const tracks: MediaStreamTrack[] | null =
      this.video.nativeElement.srcObject?.getTracks();
    if (tracks) {
      tracks.forEach((track: MediaStreamTrack) => track.stop()); // Stop all tracks in the stream
    }
  }

  ngOnDestroy(): void {
    this.stopScanner();
  }

  private handleScanResult(data: string): void {
    // Process the scanned result
    this.barService.setCode(data);
  }

  private playBeep(): void {
    const audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    oscillator.connect(audioContext.destination);
    oscillator.start();
    setTimeout(() => {
      oscillator.stop();
    }, 200);
  }
}
