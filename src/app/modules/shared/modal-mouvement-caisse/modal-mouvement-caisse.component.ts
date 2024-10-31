import { DialogRef } from '@angular/cdk/dialog';
import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ICaisses } from 'src/app/modele/caisses';
import { IMouvement } from 'src/app/modele/mouvement';
import { MoyenPaiement } from 'src/app/modele/mouvement-caisses';
import { CaissesService } from 'src/app/services/caisses/caisses.service';
import { DonneesEchangeService } from 'src/app/services/donnees-echange/donnees-echange.service';
import { MouvementCaisseService } from 'src/app/services/mouvement-caisse/mouvement-caisse.service';

@Component({
  selector: 'app-modal-mouvement-caisse',
  templateUrl: './modal-mouvement-caisse.component.html',
  styleUrls: ['./modal-mouvement-caisse.component.scss']
})
export class ModalMouvementCaisseComponent implements OnInit {

  submitted: boolean = false;
  dynamicForm: FormGroup;
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
  elementsArray: MoyenPaiement[] = [];

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
    this.dynamicForm = this.formBuilder.group({
      elements: this.formBuilder.array([]) // Utilisation de FormArray pour gérer une liste dynamique
    });
    this.formePaiement = this.formBuilder.group({
      moyen: ['cash'],
      montant: [''],
      reference: [''],
      
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

  ngOnInit(): void {
    console.log("donnee de la modal:", this.data.donnee, this.data.caisses);
    let dataCaisses: ICaisses[] = this.data.caisses;

    // Ajouter dynamiquement des objets dans le formulaire en fonction du tableau `elementsArray`
    dataCaisses.forEach((caisse) => {
      if (caisse.type != 'solde') {
        console.log('premier if');
        
        if (this.data.donnee.length > 0) {
          console.log('deuxieme if');
          
          this.data.donnee.forEach((ele:MoyenPaiement) => {
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
            reference: [''],
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
          });
          this.elements.push(elementGroup);
          console.log("elements modal :", this.elements.controls);
        }
      }
    });

    
      /* this.formePaiement.setValue({
        moyen: this.data.donnee[0].moyen,
        montant: this.data.donnee[0].montant,
        reference: this.data.donnee[0].reference
      });
      this.formePaiement1.setValue({
        moyen: this.data.donnee[1].moyen,
        montant: this.data.donnee[1].montant,
        reference: this.data.donnee[1].reference
      });
      this.formePaiement2.setValue({
        moyen: this.data.donnee[2].moyen,
        montant: this.data.donnee[2].montant,
        reference: this.data.donnee[2].reference
      });
      this.formePaiement3.setValue({
        moyen: this.data.donnee[3].moyen,
        montant: this.data.donnee[3].montant,
        reference: this.data.donnee[3].reference
      }); */
  }

  get elements(): FormArray {
    return this.dynamicForm.get('elements') as FormArray;
  }

  get f() {
    return this.formePaiement.controls;
  }

  displayFn(caisse: ICaisses): string {
    return caisse && caisse.type ? caisse.type : '';
  }

  onSubmit() {
    this.submitted = true;

    if(this.dynamicForm.invalid) return;

    const data = this.elements.value;

    console.log("value paiement :", this.elements.value);
    
    this.dialogRef.close({ result: 'Success', data: data });
  }
}
