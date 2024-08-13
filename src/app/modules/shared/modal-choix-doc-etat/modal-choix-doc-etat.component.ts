import { Component, Inject, Output, EventEmitter, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IDocument } from 'src/app/modele/document';
import { IDocEtats } from 'src/app/modele/doc-etats';
import { DonneesEchangeService } from 'src/app/services/donnees-echange/donnees-echange.service';
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
  selectedEtat: string | undefined;
  previouslySelectedEtat: IDocEtats | undefined; // Input pour recevoir les etats pre-selectionees

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder,
    private servicedonneechange: DonneesEchangeService,
    private documentService: DocumentService, // Inject DocumentService
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
      this.servicedonneechange.saveEtatModal(selectedEtat);
      
    }
    this.dialogRef.close();
  }

  onRadioChange(etat: IDocEtats): void {

    this.selectedEtatsMap = etat;
  }

  ngOnInit(): void {
    // Charge l'état précédemment sélectionné depuis DocumentService
    this.selectedEtat = this.documentService.getSelectedEtat(
      this.data.documentChoisi.id
    );
  }
}