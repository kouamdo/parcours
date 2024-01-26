import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IService } from 'src/app/modele/service';
import { DonneesEchangeService } from 'src/app/services/donnees-echange/donnees-echange.service';
import { ServicesService } from 'src/app/services/services/services.service';
import {v4 as uuidv4} from 'uuid';

@Component({
  selector: 'app-new-services',
  templateUrl: './new-services.component.html',
  styleUrls: ['./new-services.component.scss']
})
export class NewServicesComponent implements OnInit {

  service : IService|undefined;
  forme: FormGroup;
  btnLibelle: string="Ajouter";
  submitted: boolean=false;

  initialDateDerniereModification = new FormControl(new Date());
  initialDateAttribution = new FormControl(new Date());
  initialDateFin = new FormControl(new Date());
  titre:string='';
  constructor(private formBuilder:FormBuilder,private dataEnteteMenuService:DonneesEchangeService, private serviceService:ServicesService,private router:Router, private infosPath:ActivatedRoute, private datePipe: DatePipe) {
    this.forme = this.formBuilder.group({
      libelle: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      etat:[true],
      localisation:['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      description:['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]]
    })
  }

  ngOnInit(): void {
    let idService = this.infosPath.snapshot.paramMap.get('idService');
    if((idService != null) && idService!==''){
      this.btnLibelle="Modifier";
      this.titre="service à Modifier";
      this.serviceService.getServiceById(idService).subscribe(x =>
        {
          this.service = x;
          this.forme.setValue({
            libelle: this.service.libelle,
            etat: this.service.etat,
            localisation: this.service.localisation,
            description: this.service.description
          })
      });
    }
    this.titre=this.dataEnteteMenuService.dataEnteteMenu
  }

  get f(){
    return this.forme.controls;
  }

  onSubmit(serviceInput:any){
    this.submitted=true;
    //Todo la validation d'element non conforme passe
    if(this.forme.invalid) return;

    let serviceTemp : IService={
      id: uuidv4(),
      libelle: serviceInput.libelle,
      etat: serviceInput.etat,
      dateDerniereModification: serviceInput.dateDerniereModification,
      dateAttribution: serviceInput.dateAttribution,
      dateFin: serviceInput.dateFin,
      nombreTotalAttributions: serviceInput.nombreTotalAttributions,
      localisation: serviceInput.localisation,
      description: serviceInput.description
    }

    if(this.service != undefined){
      serviceTemp.id = this.service.id
    }

    this.serviceService.ajouterService(serviceTemp).subscribe(
      object => {
        this.router.navigate(['/list-services']);
      }
    )
  }
}
