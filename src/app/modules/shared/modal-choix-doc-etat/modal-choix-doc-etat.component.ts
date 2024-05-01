import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DocumentService } from 'src/app/services/documents/document.service'; // Import DocumentService
import { IDocument } from 'src/app/modele/document';

interface DialogData {
  documentChoisi: IDocument;
}

@Component({
  selector: 'app-modal-choix-doc-etat',
  templateUrl: './modal-choix-doc-etat.component.html',
  styleUrls: ['./modal-choix-doc-etat.component.css'],
})
export class ModalChoixDocEtatComponent implements OnInit {
  formeDocument: FormGroup;
  selectedEtat: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ModalChoixDocEtatComponent>,
    private documentService: DocumentService // Inject DocumentService
  ) {
    this.formeDocument = this.fb.group({});
  }

  onCancel(): void {
    this.formeDocument.reset();
    this.dialogRef.close();
  }

  onSave(documentId: string): void {
    // Save selected etat to the DocumentService
    this.documentService.setSelectedEtat(documentId, this.selectedEtat);
    this.dialogRef.close();
  }

  onRadioChange(etat: any, documentId: string): void {
    this.selectedEtat = etat.etat.libelle;
  }

  ngOnInit(): void {
    // Load previously selected etat from DocumentService
    this.selectedEtat = this.documentService.getSelectedEtat(
      this.data.documentChoisi.id
    );
  }
}
