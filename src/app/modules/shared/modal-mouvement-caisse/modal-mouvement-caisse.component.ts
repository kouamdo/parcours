import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ICaisses } from 'src/app/modele/caisses';
import { MoyenPaiement } from 'src/app/modele/mouvement-caisses';
import { DonneesEchangeService } from 'src/app/services/donnees-echange/donnees-echange.service';
import { ModalBilleterieComponent } from '../modal-billeterie/modal-billeterie.component';

@Component({
  selector: 'app-modal-mouvement-caisse',
  templateUrl: './modal-mouvement-caisse.component.html',
  styleUrls: ['./modal-mouvement-caisse.component.scss']
})
export class ModalMouvementCaisseComponent implements OnInit {

  submitted: boolean = false;
  dynamicForm: FormGroup;
  resteAPayer: number = 0;
  btnLibelle: string = 'Ajouter';
  displayedMvtCaissesColumns: string[] = [
    'Moyen de Paiement',
    'Montant a Régler',
    'Reférence de Paiement',
    'Reste'
  ];
  modalResultBilleterie: any;
  modalLastResultBilleterie: any;
  elementsArray: MoyenPaiement[] = [];

  constructor(
    private router: Router,
    private dialogRef: MatDialogRef<ModalMouvementCaisseComponent>,
    private formBuilder: FormBuilder,
    private infosPath: ActivatedRoute,
    private datePipe: DatePipe,
    private dialogDef: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dynamicForm = this.formBuilder.group({
      elements: this.formBuilder.array([]) // Utilisation de FormArray pour gérer une liste dynamique
    });
  }

  ngOnInit(): void {
    console.log("donnee de la modal:", this.data.donnee, this.data.caisses);
    let dataCaisses: ICaisses[] = this.data.caisses;

    // Ajouter dynamiquement des objets dans le formulaire en fonction du tableau `elementsArray`
    dataCaisses.forEach((caisse) => {
      if (caisse.type != 'solde') {
        console.log('premier if');

        if (this.data.donnee.length > 0) {
          console.log('deuxieme if');

          this.data.donnee.forEach((ele: MoyenPaiement) => {
            if (ele.moyen.type == caisse.type) {
              const elementGroup = this.formBuilder.group({
                moyen: new FormControl<string | ICaisses>(caisse),
                montant: [ele.montant],
                reference: [ele.reference],
              });
              this.elements.push(elementGroup);
              console.log("elements modal 0:", this.elements.controls);
            }
          })
        } else {
          console.log('troisième if');

          const elementGroup = this.formBuilder.group({
            moyen: new FormControl<string | ICaisses>(caisse),
            montant: [''],
            reference: ['']
          });
          this.elements.push(elementGroup);
          console.log("elements modal :", this.elements.controls[0]);
        }
      }
    });
  }

  onInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    inputElement.value = inputElement.value.replace(/[^0-9]/g, ''); // Supprime les caractères non numériques
  }  

  openModalBilleterieDialog(req: any, index: number) {
    console.log('valeur passée :', req.controls['moyen'].value.type, index);
    
    if (req.controls['moyen'].value.type == 'cash') {
      const dialogRef = this.dialogDef.open(ModalBilleterieComponent,
        {
          maxWidth: '100vw',
          maxHeight: '100vh',
          height: '100%',
          width: '100%',
          enterAnimationDuration: '1000ms',
          exitAnimationDuration: '1000ms',
          data:{monaies: this.modalResultBilleterie}
        }
      )
  
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.modalResultBilleterie = result.data;
          if (this.modalLastResultBilleterie) {
            if (this.modalLastResultBilleterie.x1) this.resteAPayer -= this.modalLastResultBilleterie.x1;
            if (this.modalLastResultBilleterie.x2) this.resteAPayer -= this.modalLastResultBilleterie.x2 * 2;
            if (this.modalLastResultBilleterie.x5) this.resteAPayer -= this.modalLastResultBilleterie.x5 * 5;
            if (this.modalLastResultBilleterie.x10) this.resteAPayer -= this.modalLastResultBilleterie.x10 * 10;
            if (this.modalLastResultBilleterie.x25) this.resteAPayer -= this.modalLastResultBilleterie.x25 * 25;
            if (this.modalLastResultBilleterie.x50) this.resteAPayer -= this.modalLastResultBilleterie.x50 * 50;
            if (this.modalLastResultBilleterie.x100) this.resteAPayer -= this.modalLastResultBilleterie.x100 * 100;
            if (this.modalLastResultBilleterie.x500) this.resteAPayer -= this.modalLastResultBilleterie.x500 * 500;
            if (this.modalLastResultBilleterie.x500B) this.resteAPayer -= this.modalLastResultBilleterie.x500B * 500;
            if (this.modalLastResultBilleterie.x1000) this.resteAPayer -= this.modalLastResultBilleterie.x1000 * 1000;
            if (this.modalLastResultBilleterie.x2000) this.resteAPayer -= this.modalLastResultBilleterie.x2000 * 2000;
            if (this.modalLastResultBilleterie.x5000) this.resteAPayer -= this.modalLastResultBilleterie.x5000 * 5000;
            if (this.modalLastResultBilleterie.x10000) this.resteAPayer -= this.modalLastResultBilleterie.x10000 * 10000;
          }
          if (this.modalResultBilleterie.x1) this.resteApayer(this.modalResultBilleterie.x1);
          if (this.modalResultBilleterie.x2) this.resteApayer(this.modalResultBilleterie.x2 * 2);
          if (this.modalResultBilleterie.x5) this.resteApayer(this.modalResultBilleterie.x5 * 5);
          if (this.modalResultBilleterie.x10) this.resteApayer(this.modalResultBilleterie.x10 * 10);
          if (this.modalResultBilleterie.x25) this.resteApayer(this.modalResultBilleterie.x25 * 25);
          if (this.modalResultBilleterie.x50) this.resteApayer(this.modalResultBilleterie.x50 * 50);
          if (this.modalResultBilleterie.x100) this.resteApayer(this.modalResultBilleterie.x100 * 100);
          if (this.modalResultBilleterie.x500) this.resteApayer(this.modalResultBilleterie.x500 * 500);
          if (this.modalResultBilleterie.x500B) this.resteApayer(this.modalResultBilleterie.x500B * 500);
          if (this.modalResultBilleterie.x1000) this.resteApayer(this.modalResultBilleterie.x1000 * 1000);
          if (this.modalResultBilleterie.x2000) this.resteApayer(this.modalResultBilleterie.x2000 * 2000);
          if (this.modalResultBilleterie.x5000) this.resteApayer(this.modalResultBilleterie.x5000 * 5000);
          if (this.modalResultBilleterie.x10000) this.resteApayer(this.modalResultBilleterie.x10000 * 10000);
          this.modalLastResultBilleterie = result.data;
          req.controls['montant'].setValue(this.resteAPayer);
          console.log('result Billeterie:', this.modalResultBilleterie);
        }
      });
    }
  }

  resteApayer(montant: number): number {
    this.resteAPayer += montant;
    //this.elements['montant'].setValue(this.sommeMontants() - this.resteAPayer)
    return this.resteAPayer;
  }

  get elements(): FormArray {
    return this.dynamicForm.get('elements') as FormArray;
  }

  displayFn(caisse: ICaisses): string {
    return caisse && caisse.type ? caisse.type : '';
  }

  onSubmit() {
    this.submitted = true;

    if (this.dynamicForm.invalid) return;

    const data = this.elements.value;

    console.log("value paiement :", this.elements.value);

    this.dialogRef.close({ result: 'Success', data: data });
  }
}
