import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  constructor(private formBuilder:FormBuilder, private missionService:MissionsService,private router:Router, private infosPath:ActivatedRoute) {
    this.forme = this.formBuilder.group({
      libelle: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      etat: ['False', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
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
            dateCreation: this.mission.dateCreation,
            dateModification: this.mission.dateModification
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
