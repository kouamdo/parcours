import { Component, Input, ViewEncapsulation } from '@angular/core';
import { ModalCodebarreComponent } from '../modal-codebarre/modal-codebarre.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-codebarre-dialog',
  templateUrl: './modal-codebarre-dialog.component.html',
  styleUrls: ['./modal-codebarre-dialog.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ModalCodebarreDialogComponent {
  @Input() multipleScan: boolean = false;

  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(ModalCodebarreComponent, {
      height: '380px',
      width: '500px',
      data: { multipleScan: this.multipleScan },
      disableClose: true, // This option disables closing the dialog by clicking outside
      hasBackdrop: true,
    });
  }
}
