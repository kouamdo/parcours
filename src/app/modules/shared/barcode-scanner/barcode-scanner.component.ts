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
}
