import { Component, Inject, Output, EventEmitter, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IDocument } from 'src/app/modele/document';
import { IDocEtats } from 'src/app/modele/doc-etats';
import { DocumentService } from 'src/app/services/documents/document.service';

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
  selectedEtat: string = '';
  @Output() saveChanges: EventEmitter<IDocEtats> = new EventEmitter<IDocEtats>();
  @Input() previouslySelectedEtat: IDocEtats | undefined; // Input to receive the previously selected etat

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ModalChoixDocEtatComponent>,
    private documentService: DocumentService // Inject DocumentService
  ) {
    this.formeEtat = this.fb.group({});
  }

  onCancel(): void {
    this.formeEtat.reset();
    this.dialogRef.close();
  }

  onSave(documentId: string): void {
    // Enregistrer l'etat au DocumentService
    this.documentService.setSelectedEtat(documentId, this.selectedEtat);
    this.dialogRef.close();
  }

  onRadioChange(etat: IDocEtats): void {

    this.selectedEtatsMap = etat;
    console.log("change etat :", this.selectedEtatsMap);
    
  }

  ngOnInit(): void {
    // Charger les etats selectionees a partir de DocumentService
    this.selectedEtat = this.documentService.getSelectedEtat(
      this.data.documentChoisi.id
    );
  }
}