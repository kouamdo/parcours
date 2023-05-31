import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, MaxLengthValidator,MinLengthValidator,ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { IService } from 'src/app/modele/service';
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
  titre: string="Ajouter un nouveau service";
  submitted: boolean=false;
  
  initialDateDerniereModification = new FormControl(new Date());
  initialDateAttribution = new FormControl(new Date());
  initialDateFin = new FormControl(new Date());

  constructor(private formBuilder:FormBuilder, private serviceService:ServicesService,private router:Router, private infosPath:ActivatedRoute, private datePipe: DatePipe) { 
    this.forme = this.formBuilder.group({
      libelle: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      etat: ['Non assigne', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      dateDerniereModification: ['/', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      dateAttribution: ['/'],
      dateFin: ['/']
    })
  }

  ngOnInit(): void {
    let idService = this.infosPath.snapshot.paramMap.get('idService');
    if((idService != null) && idService!==''){
      this.btnLibelle="Modifier";
      this.titre="service à Modifier";
      this.serviceService.getServiceById(idService).subscribe(x =>
        {
          this.service = x; console.log(this.service);
          this.forme.setValue({
            libelle: this.service.libelle,
            etat: this.service.etat,
            dateDerniereModification: this.datePipe.transform(this.service.dateDerniereModification,'yyyy-MM-dd'),
            dateAttribution: this.datePipe.transform(this.service.dateAttribution,'yyyy-MM-dd'),
            dateFin:  this.datePipe.transform(this.service.dateFin,'yyyy-MM-dd')
          })
      });
    }
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
      nombreTotalAttributions: serviceInput.nombreTotalAttributions
    }

    if(this.service != undefined){
      serviceTemp.id = this.service.id  
    }
    
    this.serviceService.ajouterService(serviceTemp).subscribe(
      object => {
        this.router.navigate(['/list-services']);
      },
      error =>{
        console.log(error)
      }
    )
  }
}
