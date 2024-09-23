import { DialogRef } from '@angular/cdk/dialog';
import { DatePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ICaisses } from 'src/app/modele/caisses';
import { MoyenPaiement } from 'src/app/modele/mouvement-caisses';
import { DonneesEchangeService } from 'src/app/services/donnees-echange/donnees-echange.service';
import { MouvementCaisseService } from 'src/app/services/mouvement-caisse/mouvement-caisse.service';

@Component({
  selector: 'app-modal-mouvement-caisse',
  templateUrl: './modal-mouvement-caisse.component.html',
  styleUrls: ['./modal-mouvement-caisse.component.scss']
})
export class ModalMouvementCaisseComponent {

  submitted: boolean = false;
  formePaiement: FormGroup;
  formePaiement1: FormGroup;
  formePaiement2: FormGroup;
  formePaiement3: FormGroup;
  btnLibelle: string = 'Ajouter';
  displayedMvtCaissesColumns: string[] = [
    'Moyen de Paiement',
    'Montant a Régler',
    'Reférence de Paiement',
    'Reste'
  ];

  constructor(
    private router: Router,
    private dialogRef: MatDialogRef<ModalMouvementCaisseComponent>,
    private formBuilder: FormBuilder,
    private donneeEchangeService:DonneesEchangeService,
    private infosPath: ActivatedRoute,
    private datePipe: DatePipe,
    private mvtCaisseService: MouvementCaisseService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.formePaiement = this.formBuilder.group({
      moyen: ['cash'],
      montant: [''],
      reference: ['']
    })
    this.formePaiement1 = this.formBuilder.group({
      moyen: ['cheque'],
      montant: [''],
      reference: ['']
    })
    this.formePaiement2 = this.formBuilder.group({
      moyen: ['carte bleue'],
      montant: [''],
      reference: ['']
    })
    this.formePaiement3 = this.formBuilder.group({
      moyen: ['mobile money'],
      montant: [''],
      reference: ['']
    })
  }

  get f() {
    return this.formePaiement.controls;
  }

  onSubmit() {
    this.submitted = true;

    if(this.formePaiement.invalid) return;

    const data = {
      element: this.formePaiement.value,
      element1: this.formePaiement1.value,
      element2: this.formePaiement2.value,
      element3: this.formePaiement3.value
    };

    console.log("value paiement :", this.formePaiement.value, this.formePaiement1.value, this.formePaiement2.value, this.formePaiement3.value);
    
    this.dialogRef.close({ result: 'Success', data: data });
  }
}
