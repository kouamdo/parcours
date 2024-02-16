import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  Inject,
} from '@angular/core';
import { BrowserMultiFormatReader, DecodeHintType } from '@zxing/library';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'; // Import MatDialogRef
import { ModalCodebarreService } from './modal-codebarre.service';

@Component({
  selector: 'app-modal-codebarre',
  templateUrl: './modal-codebarre.component.html',
  styleUrls: ['./modal-codebarre.component.css'],
})
export class ModalCodebarreComponent implements AfterViewInit, OnDestroy {
  @ViewChild('video', { static: false }) video!: ElementRef;
  scannedData: string | undefined = 'Scan';
  scannedDataList: string[] = [];
  isScanning: boolean = false;
  multipleScan: boolean;

  constructor(
    private barService: ModalCodebarreService,
    @Inject(MAT_DIALOG_DATA) data: any,
    private dialogRef: MatDialogRef<ModalCodebarreComponent> // Inject MatDialogRef
  ) {
    this.multipleScan = data.multipleScan;
  }

  ngAfterViewInit(): void {
    this.toggleScanner();
  }

  ngOnDestroy(): void {
    this.stopScanner();
  }

  toggleScanner(): void {
    this.isScanning = !this.isScanning;
    if (this.isScanning) {
      if (this.multipleScan) {
        this.scanMultipleCodes();
      } else {
        this.scanCode();
      }
    } else {
      this.stopScanner();
    }
  }

  scanCode(): void {
    const codeReader = new BrowserMultiFormatReader(undefined, 500);
    const hints = new Map<DecodeHintType, any[]>();
    hints.set(DecodeHintType.TRY_HARDER, [true]); // Add the tryHarder option
    codeReader.hints = hints;

    codeReader
      .decodeFromInputVideoDevice(undefined, this.video.nativeElement)
      .then((result) => {
        this.handleScanResult(result.getText());
        this.playBeep(); // Play beep sound after each scan
        this.isScanning = false;
        this.dialogRef.close(); // Close the modal
      })
      .catch((err) => {
        console.error('Error while scanning: ', err);
        this.isScanning = false;
      });
  }

  scanMultipleCodes(): void {
    const codeReader = new BrowserMultiFormatReader(undefined, 500);
    const hints = new Map<DecodeHintType, any[]>();
    hints.set(DecodeHintType.TRY_HARDER, [true]); // Add the tryHarder option
    codeReader.hints = hints;

    codeReader
      .decodeFromInputVideoDevice(undefined, this.video.nativeElement)
      .then((result) => {
        this.handleScanResult(result.getText());
        this.scannedDataList.push(result.getText());
        this.playBeep();
        this.isScanning = false;
        console.log('data list', this.scannedDataList);
        this.stopScannerForDelay();
      })
      .catch((err) => {
        console.error('Error while scanning: ', err);
        this.isScanning = false;
        setTimeout(() => {
          this.scanMultipleCodes();
        }, 1000);
      });
  }

  stopScannerForDelay(): void {
    setTimeout(() => {
      this.scanMultipleCodes(); // Restart the scanner after a delay
    }, 1000); // 1000 milliseconds (adjust as needed)
  }

  stopScanner(): void {
    this.isScanning = false;
    const tracks: MediaStreamTrack[] | null =
      this.video.nativeElement.srcObject?.getTracks();
    if (tracks) {
      tracks.forEach((track: MediaStreamTrack) => track.stop()); // Stop all tracks in the stream
    }
  }

  handleScanResult(scannedData: string): void {
    this.barService.setCode(scannedData);
    console.log('Scaaaaan', scannedData);
  }

  playBeep(): void {
    const audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();

    const oscillator = audioContext.createOscillator();
    oscillator.connect(audioContext.destination);
    oscillator.start();

    setTimeout(() => {
      oscillator.stop();
    }, 200);
  }

  closeModal(): void {
    this.dialogRef.close(); // Close the modal
  }
}
