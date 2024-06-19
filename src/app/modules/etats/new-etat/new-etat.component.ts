import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IEtats } from 'src/app/modele/etats';
import { DonneesEchangeService } from 'src/app/services/donnees-echange/donnees-echange.service';
import { EtatService } from 'src/app/services/etats/etats.service';
import {v4 as uuidv4} from 'uuid';

@Component({
  selector: 'app-new-etat',
  templateUrl: './new-etat.component.html',
  styleUrls: ['./new-etat.component.scss']
})
export class NewEtatComponent {
  etats : IEtats|undefined;
  formeEtat: FormGroup;
  btnLibelle: string="Ajouter";
  submitted: boolean=false;

  constructor(private formBuilder:FormBuilder,private dataEnteteMenuService:DonneesEchangeService, private EtatService: EtatService,private router:Router, private infosPath:ActivatedRoute) {
    this.formeEtat = this.formBuilder.group({
      libelle: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      description:['']
    })
  }

  ngOnInit(): void {
    let idEtat = this.infosPath.snapshot.paramMap.get('idEtat');
    if((idEtat != null) && idEtat!==''){
      this.btnLibelle="Modifier";
      this.EtatService.getEtatById(idEtat).subscribe(x =>
        {
          this.etats = x;
          this.formeEtat.setValue({
            libelle: this.etats.libelle,
            description: this.etats.description
          })
      });
    }
  }

  get f(){
    return this.formeEtat.controls;
  }

  onSubmit(etatsInput:any){
    this.submitted=true;
    
    if(this.formeEtat.invalid) return;

    let etatTemp : IEtats={
      id: uuidv4(),
      libelle: etatsInput.libelle,
      description: etatsInput.description,
      dateCreation: new Date()
    }

    if(this.etats != undefined){
      etatTemp.id = this.etats.id
    }

    this.EtatService.ajouterEtat(etatTemp).subscribe(
      object => {
        this.router.navigate(['/list-etats']);
      }
    )
  }

}
