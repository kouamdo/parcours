import { Component, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CodeBarreContinuService } from 'src/app/services/code-barre-continu/code-barre-continu.service';

@Component({
  selector: 'app-barcode-scanner',
  templateUrl: './barcode-scanner.component.html',
  styleUrls: ['./barcode-scanner.component.scss']
})
export class BarcodeScannerComponent implements OnDestroy {
  isScannerClosed = false;

  constructor(private barcodeScannerService: CodeBarreContinuService) {}

  @Output() scannerClosed = new EventEmitter<void>();
  handleScanSuccess(result: string) {
    this.playBeep();
    this.barcodeScannerService.setScanResult(result);
    // Permettre le scan continu sans réinitialiser
  }

  closeScanner() {
    this.isScannerClosed = true;
    this.scannerClosed.emit(); // Avertit le composant parent que le scanner est fermé
  }

  ngOnDestroy() {
    this.isScannerClosed = true; // Arrête la caméra si le composant est détruit
  }

playBeep() {
  const audioContext = new AudioContext();
  const oscillator = audioContext.createOscillator();
  oscillator.type = 'sine'; // Type de son, ici "sine" pour un son simple
  oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // 440 Hz, fréquence pour un bip classique
  oscillator.connect(audioContext.destination);
  oscillator.start();
  setTimeout(() => {
    oscillator.stop();
    audioContext.close();
  }, 100); // Durée du bip en millisecondes
}

}
