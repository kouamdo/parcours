import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IAttributs } from 'src/app/modele/attributs';
import { TypeTicket } from 'src/app/modele/type-ticket';
import { AttributService } from 'src/app/services/attributs/attribut.service';

@Component({
  selector: 'app-new-attribut',
  templateUrl: './new-attribut.component.html',
  styleUrls: ['./new-attribut.component.scss']
})
export class NewAttributComponent implements OnInit {
  attribut : IAttributs|undefined;
  forme: FormGroup;
  btnLibelle: string="Ajouter";
  titre: string="Ajouter un nouvel attribut";
  submitted: boolean=false;

  typeInt = TypeTicket.Int;
  typeString = TypeTicket.String;
  typeDouble = TypeTicket.Double;
  typeFloat = TypeTicket.Float;
  typeBoolean = TypeTicket.Boolean;
  typeDate = TypeTicket.Date;

  initialDateCreation = new FormControl(new Date());
  initialDateModification = new FormControl(new Date());

  constructor(private formBuilder:FormBuilder, private attributService:AttributService,private router:Router, private infosPath:ActivatedRoute, private datePipe: DatePipe) {
    this.forme = this.formBuilder.group({
      titre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      etat: ['False', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      dateCreation: ['', [Validators.required]],
      dateModification: ['//'],
      unite: ['']
    })
  }

  ngOnInit(): void {
    let idAttribut = this.infosPath.snapshot.paramMap.get('idAttribut');
    if((idAttribut != null) && idAttribut!==''){
      this.btnLibelle="Modifier";
      this.titre="service à Modifier";
      this.attributService.getAttributById(idAttribut).subscribe(x =>
        {
          this.attribut = x; console.log(this.attribut);
          this.attribut.id = idAttribut!,
          this.forme.setValue({
            titre: this.attribut.titre,
            description: this.attribut.description,
            etat: this.attribut.etat,
            dateCreation: this.datePipe.transform(this.attribut.dateCreation,'yyyy-MM-dd'),
            dateModification: this.datePipe.transform(this.attribut.dateModification,'yyyy-MM-dd'),
            unite: this.attribut.type
          })
      });
    }
  }

  get f(){
    return this.forme.controls;
  }

  onSubmit(attributInput:any){

    this.submitted=true;
    if(this.forme.invalid) return;

    let attributTemp : IAttributs={
      id: "10",
      titre: attributInput.titre,
      description: attributInput.description,
      etat: attributInput.etat,
      dateCreation: attributInput.dateCreation,
      dateModification: attributInput.dateModification,
      type: attributInput.type
    }
    attributTemp.dateCreation = this.initialDateCreation.value!
    attributTemp.dateModification = this.initialDateModification.value!

    if(this.attribut != undefined){
      attributTemp.id = this.attribut.id
    }

    this.attributService.ajouterAttribut(attributTemp).subscribe(
      object => {
        this.router.navigate(['/list-attributs']);
      },
      error =>{
        console.log(error)
      }
    )
  }
}
