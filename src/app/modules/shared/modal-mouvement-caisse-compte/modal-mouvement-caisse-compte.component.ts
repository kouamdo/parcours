import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import { MatSort, Sort } from '@angular/material/sort';
import { ICaisses } from 'src/app/modele/caisses';
import { IComptes } from 'src/app/modele/comptes';
import { IExemplaireDocument } from 'src/app/modele/exemplaire-document';
import { IExemplairesDePersonne } from 'src/app/modele/exemplaires-de-personne';
import { IMouvementCaisses } from 'src/app/modele/mouvement-caisses';
import { IPersonnel } from 'src/app/modele/personnel';
import { CaissesService } from 'src/app/services/caisses/caisses.service';
import { ComptesService } from 'src/app/services/comptes/comptes.service';
import { ExemplaireDocumentService } from 'src/app/services/exemplaire-document/exemplaire-document.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { DialogRef } from '@angular/cdk/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MouvementCaisseService } from 'src/app/services/mouvement-caisse/mouvement-caisse.service';
import { IPatient } from 'src/app/modele/Patient';

@Component({
  selector: 'app-modal-mouvement-caisse-compte',
  templateUrl: './modal-mouvement-caisse-compte.component.html',
  styleUrls: ['./modal-mouvement-caisse-compte.component.scss']
})
export class ModalMouvementCaisseCompteComponent implements OnInit {
  forme: FormGroup;
  btnLibelle: string = 'Ajouter';
  //titre: string="Ajouter attribut";
  submitted: boolean = false;
  titre: string = '';
  compte: IComptes | undefined
  caisses: ICaisses[] = []
  exemplaires: IExemplaireDocument[] = []
  person: IPatient | undefined;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialogRef: DialogRef,
    private formBuilder: FormBuilder,
    private caisseService: CaissesService,
    private exemplaireDoc: ExemplaireDocumentService,
    private _liveAnnouncer: LiveAnnouncer,
    private compteService: ComptesService,
    private mvtCaisseService: MouvementCaisseService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.forme = this.formBuilder.group({
      etat: [true],
      libelle: ['', [Validators.required]],
      typeMvt: ['', [Validators.required]],
      moyenPaiement: ['', [Validators.required]],
      referencePaiement: ['', [Validators.required]],
      caisse: new FormControl<string | ICaisses>('')
    });
  }

  ngOnInit(): void {
    this.person = this.data.personnel;
    this.caisseService.getAllCaisses().subscribe(
      (reponse) =>{
        this.caisses=reponse
      }
    );

    this.exemplaireDoc.getAllExemplaireDocuments().subscribe(
      (res) => {
        this.exemplaires = res;
      }
    );

    this.compteService.getCompteByUser(this.person!.id).subscribe((res) => {
      if (res) {
        this.compte = res;
      }
    })
  }

  get f() {
    return this.forme.controls;
  }

  displayFn(element: ICaisses): string {
    return element && element.libelle ? element.libelle : '';
  }

  onSubmit(selectItem: any) {
    this.submitted = true;

    if(this.forme.invalid) return;

    let mvtCaisse: IMouvementCaisses = {
      id: uuidv4(),
      etat: selectItem.etat,
      montant: this.data.montant,
      libelle: selectItem.libelle,
      typeMvt: selectItem.typeMvt,
      dateCreation: new Date(),
      moyenPaiement: selectItem.moyenPaiement,
      referencePaiement: selectItem.referencePaiement,
      compte: this.compte,
      personnel: this.person!,
      exemplaire: this.data.exemplaire

    }

    this.mvtCaisseService.ajouterMouvement(mvtCaisse).subscribe((obj) => {
      this.dialogRef.close();
    })
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}
