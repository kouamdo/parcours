import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ICaisses } from 'src/app/modele/caisses';
import { MoyenPaiement } from 'src/app/modele/mouvement-caisses';
import { DonneesEchangeService } from 'src/app/services/donnees-echange/donnees-echange.service';
import { MouvementCaisseService } from 'src/app/services/mouvement-caisse/mouvement-caisse.service';

@Component({
  selector: 'app-modal-billeterie',
  templateUrl: './modal-billeterie.component.html',
  styleUrls: ['./modal-billeterie.component.scss']
})
export class ModalBilleterieComponent implements OnInit {
  submitted: boolean = false;
  formePaiement: FormGroup;
  btnLibelle: string = 'Ajouter';

  constructor(
    private router: Router,
    private dialogRef: MatDialogRef<ModalBilleterieComponent>,
    private formBuilder: FormBuilder,
    private donneeEchangeService: DonneesEchangeService,
    private infosPath: ActivatedRoute,
    private datePipe: DatePipe,
    private mvtCaisseService: MouvementCaisseService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.formePaiement = this.formBuilder.group({
      // enregistrer la billeterie en cas de cash comme moyen de paiement
      x1: [''],
      x2: [''],
      x5: [''],
      x10: [''],
      x25: [''],
      x50: [''],
      x100: [''],
      x500: [''],
      x500B: [''],
      x1000: [''],
      x2000: [''],
      x5000: [''],
      x10000: ['']
    })
  }

  ngOnInit(): void {
    console.log("donnee de la modal:", this.data.monaies);


    this.formePaiement.setValue({
      x1: this.data.monaies.x1,
      x2: this.data.monaies.x2,
      x5: this.data.monaies.x5,
      x10: this.data.monaies.x10,
      x25: this.data.monaies.x25,
      x50: this.data.monaies.x50,
      x100: this.data.monaies.x100,
      x500: this.data.monaies.x500,
      x500B: this.data.monaies.x500B,
      x1000: this.data.monaies.x1000,
      x2000: this.data.monaies.x2000,
      x5000: this.data.monaies.x5000,
      x10000: this.data.monaies.x10000
    });
  }

  get f() {
    return this.formePaiement.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.formePaiement.invalid) return;

    const data = this.formePaiement.value;

    console.log("value paiement :", this.formePaiement.value);

    this.dialogRef.close({ result: 'Success', data: data });
  }
}
