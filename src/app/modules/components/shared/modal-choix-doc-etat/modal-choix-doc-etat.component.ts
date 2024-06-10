import { Component, Inject, Output, EventEmitter, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IDocument } from 'src/app/modele/document';
import { IDocEtats } from 'src/app/modele/doc-etats';

interface DialogData {
  EtatsChoisi: IDocEtats[];
  documentChoisi: IDocument;
  selectedEtat?: IDocEtats;
}

@Component({
  selector: 'app-modal-choix-doc-etat',
  templateUrl: './modal-choix-doc-etat.component.html',
  styleUrls: ['./modal-choix-doc-etat.component.scss'],
})
export class ModalChoixDocEtatComponent {
  selectedEtatsMap: IDocEtats | undefined;
  formeEtat: FormGroup;
  selectedEtat: IDocEtats | undefined;
  @Output() saveChanges: EventEmitter<IDocEtats> = new EventEmitter<IDocEtats>();
  @Input() previouslySelectedEtat: IDocEtats | undefined; // Input to receive the previously selected etat

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ModalChoixDocEtatComponent>
  ) {
    this.formeEtat = this.fb.group({});
  }

  onCancel(): void {
    this.formeEtat.reset();
    this.dialogRef.close();
  }

  onSave(): void {
    let selectedEtat = this.selectedEtatsMap;

    if (selectedEtat) {
      this.saveChanges.emit(selectedEtat);
      console.log("etat :", selectedEtat);
      
    }
    this.dialogRef.close();
  }

  onRadioChange(etat: IDocEtats): void {

    this.selectedEtatsMap = etat;
    console.log("change etat :", this.selectedEtatsMap);
    
  }

  ngOnInit(): void {
    this.selectedEtat = this.previouslySelectedEtat || undefined; // Set the selected etat when component initializes
  }
}