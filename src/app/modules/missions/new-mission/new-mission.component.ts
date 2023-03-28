import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IMission } from 'src/app/modele/mission';
import { MissionsService } from 'src/app/services/missions/missions.service';

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

  initialDateCreation = new FormControl(new Date());
  initialDateModification = new FormControl(new Date());

  constructor(private formBuilder:FormBuilder, private missionService:MissionsService,private router:Router, private infosPath:ActivatedRoute, private datePipe: DatePipe) {
    this.forme = this.formBuilder.group({
      libelle: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      etat: ['False', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      dateCreation: ['/', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      dateModification: ['/']
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
            dateModification: this.datePipe.transform(this.mission.dateModification,'yyyy-MM-dd')
          })
      });
    }
  }

  get f(){
    return this.forme.controls;
  }

  onSubmit(missionInput:any){

    this.submitted=true;
    if(this.forme.invalid) return;

    let missionTemp : IMission={
      id: "29",
      libelle: missionInput.libelle,
      description: missionInput.description,
      etat: missionInput.etat,
      dateCreation: missionInput.dateCreation,
      dateModification: missionInput.dateModification
    }

    missionTemp.dateCreation = this.initialDateCreation.value!
    missionTemp.dateModification = this.initialDateModification.value!

    if(this.mission != undefined){
      missionTemp.id = this.mission.id  
    }
    this.missionService.ajouterMission(missionTemp).subscribe(
      object => {
        this.router.navigate(['/list-missions']);
      },
      error =>{
        console.log(error)
      }
    )
  }
}
