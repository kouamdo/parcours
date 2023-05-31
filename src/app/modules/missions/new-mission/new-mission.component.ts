import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, EMPTY } from 'rxjs';
import { IMission } from 'src/app/modele/mission';
import { IService } from 'src/app/modele/service';
import { MissionsService } from 'src/app/services/missions/missions.service';
import { ServicesService } from 'src/app/services/services/services.service';
import {v4 as uuidv4} from 'uuid';

@Component({
  selector: 'app-new-mission',
  templateUrl: './new-mission.component.html',
  styleUrls: ['./new-mission.component.scss']
})
export class NewMissionComponent implements OnInit {
  mission : IMission|undefined;
  forme: FormGroup;
  btnLibelle: string="Ajouter";
  titre: string="Ajouter une nouvelle mission";
  submitted: boolean=false;
  services$: Observable<IService[]>=EMPTY;
  idService: string = ""
  service : IService | undefined 

  initialDateCreation = new FormControl(new Date());
  initialDateModification = new FormControl(new Date());

  constructor(private formBuilder:FormBuilder, private missionService:MissionsService,private router:Router, private infosPath:ActivatedRoute, private datePipe: DatePipe, private serviceService:ServicesService) {
    this.forme = this.formBuilder.group({
      libelle: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      etat: ['False', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      dateCreation: ['/', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      dateModification: ['/'],
      service: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    let idMission = this.infosPath.snapshot.paramMap.get('idMission');
    if((idMission != null) && idMission!==''){
      this.btnLibelle="Modifier";
      this.titre="service à Modifier";
      this.missionService.getMissionById(idMission).subscribe(x =>
        {
          this.mission = x; console.log(this.mission);
          this.forme.setValue({
            libelle: this.mission.libelle,
            description: this.mission.description,
            etat: this.mission.etat,
            dateCreation: this.datePipe.transform(this.mission.dateCreation,'yyyy-MM-dd'),
            dateModification: this.datePipe.transform(this.mission.dateModification,'yyyy-MM-dd'),
            service: this.mission.service
          })
      });
    }
    this.services$ = this.getAllServices();
  }

  associerService(event: any){
    const _serviceSelected = (this.forme.get('service'))!.value;
    console.log('le service est : ', _serviceSelected)
    if (event.target.checked) {
      this.idService = _serviceSelected
      this.serviceService.getServiceById(this.idService).subscribe(
        value => {
          this.service = value
          console.log('value est : ', this.service)
        }
      )
    }
  }
  get f(){
    return this.forme.controls;
  }

  onSubmit(missionInput:any){

    this.submitted=true;
    // const _serviceSelected = (this.forme.get('service'))!.value;
    // this.idService = _serviceSelected
    // console.log('le service est : ', _serviceSelected)
    if(this.forme.invalid) return;

    let missionTemp : IMission={
      id: uuidv4(),
      libelle: missionInput.libelle,
      description: missionInput.description,
      etat: missionInput.etat,
      dateCreation: missionInput.dateCreation,
      dateModification: missionInput.dateModification,
      service: missionInput.service
    }

    // this.serviceService.getServiceById(this.idService).subscribe(
    //   value => {
    //     missionTemp.service = value
    //     console.log('value est : ', missionTemp.service)
    //   }
    // )
    missionTemp.service = this.service!
    missionTemp.dateCreation = this.initialDateCreation.value!
    missionTemp.dateModification = this.initialDateModification.value!

    if(this.mission != undefined){
      missionTemp.id = this.mission.id  
    }
    console.log('le resultat est : ', missionTemp.service.libelle)
    this.missionService.ajouterMission(missionTemp).subscribe(
      object => {
        this.router.navigate(['/list-missions']);
      },
      error =>{
        console.log(error)
      }
    )
  }
  private getAllServices(){
    return this.serviceService.getAllServices();
  }
}