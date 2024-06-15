import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { Observable, EMPTY } from 'rxjs';
import { IEtape } from 'src/app/modele/etape';
import { DonneesEchangeService } from 'src/app/services/donnees-echange/donnees-echange.service';
import { EtapesService } from 'src/app/services/etapes/etapes.service';
import { v4 as uuidv4 } from 'uuid';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DocumentService } from 'src/app/services/documents/document.service';
import { IDocument } from 'src/app/modele/document';
import { ModalChoixSousDocumentComponent } from '../../shared/modal-choix-sous-document/modal-choix-sous-document.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-new-etape',
  templateUrl: './new-etape.component.html',
  styleUrls: ['./new-etape.component.scss'],
})
export class NewEtapeComponent implements OnInit {
  // : IEtape |undefined;
  forme: FormGroup;
  btnLibelle: string = 'Ajouter';
  submitted: boolean = false;
  titre: string = '';
  documents: IDocument[] = [];
  documentId: string[] = [];

  etape: IEtape = {
    id: '',
    libelle: '',
    etat: false,
    document: [],
  };
  // variables Document, pour afficher le tableau d'Document sur l'IHM
  ELEMENTS_TABLE_DOCUMENTS: IDocument[] = [];
  dataSourceDocument = new MatTableDataSource<IDocument>(
    this.ELEMENTS_TABLE_DOCUMENTS
  );
  dataSourceDocumentResultat = new MatTableDataSource<IDocument>();

  ELEMENTS_TABLE_CATEGORIES: IDocument[] = []; //tableau de listing des Document a affecter a chaque categorie

  //tableau contenent les sous documents
  ELEMENTS_TABLE_SOUS_DOCUMENTS: IDocument[] = [];

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private formBuilder: FormBuilder,
    private etapeService: EtapesService,
    private dataEnteteMenuService: DonneesEchangeService,
    private router: Router,
    private infosPath: ActivatedRoute,
    private datePipe: DatePipe,
    private serviceDocument: DocumentService,
    private dialogDef: MatDialog,
    private donneeDocCatService: DonneesEchangeService,
    private dialogRef: MatDialogRef<NewEtapeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.forme = this.formBuilder.group({
      libelle: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      etat: [true],
      documents: [[]],
    });
  }

  closeDialog() {
    this.dialogRef.close(); // close the dialog
  }

  ngOnInit() {
    let idEtape = this.data?.idEtape;
    if (idEtape != null && idEtape !== '') {
      this.btnLibelle = 'Modifier';

      //trouver un autre moyen d'initialiser avec des valeurs
      this.etapeService.getEtapeById(idEtape).subscribe((x) => {
        console.log('x', x);

        this.etape = x;
        this.documents = this.etape.document;

        this.forme.patchValue({
          libelle: this.etape.libelle,
          etat: this.etape.etat,
        });
        this.documentId = this.etape.document.map((doc) => doc.id);
      });
    }
  }

  get f() {
    return this.forme.controls;
  }

  /**
   * Methode permettant d'ouvrir la modal permettant d'associer des sous documents au document
   */
  openSousDocumentDialog() {
    const dialogConfig = new MatDialogConfig();

    if (this.documentId.length > 0) {
      dialogConfig.data = { documentIds: this.documentId };
    }
    console.log('Preparing to open dialog with document IDs:', this.documentId);

    (dialogConfig.maxWidth = '100vw'),
      (dialogConfig.maxHeight = '100vh'),
      (dialogConfig.width = '100%'),
      (dialogConfig.height = '100%'),
      (dialogConfig.enterAnimationDuration = '1000ms'),
      (dialogConfig.exitAnimationDuration = '1000ms');

    const dialogRef = this.dialogDef.open(
      ModalChoixSousDocumentComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe((result) => {
      this.documents = this.donneeDocCatService.dataDocumentSousDocuments;

      if (this.documents.length > 0) {
        this.documentId = this.documents.map((doc) => doc.id);
      }
    });
  }

  closeModal() {
    // Reset document selection array
    this.dialogRef.close();
  }

  onSubmit() {
    this.submitted = true;
    // Validate form
    if (this.forme.invalid) return;

    // Create etape object
    const etapeTemp = {
      id: uuidv4(),
      libelle: this.f['libelle'].value,
      etat: this.f['etat'].value,
      document: this.documents,
    };
    console.log('etapeTemp', etapeTemp);

    // If updating existing etape, set its id
    if (this.etape.id != '') {
      etapeTemp.id = this.etape.id;
    }

    this.etapeService.ajouterEtape(etapeTemp).subscribe(() => {
      this.dialogRef.close(etapeTemp);
    });
  }
}
