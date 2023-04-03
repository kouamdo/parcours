import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IExemplaireDocument } from 'src/app/modele/exemplaire-document';
import { AttributService } from 'src/app/services/attributs/attribut.service';
import { DocumentService } from 'src/app/services/documents/document.service';
import { ExemplaireDocumentService } from 'src/app/services/exemplaire-document/exemplaire-document.service';
import { MissionsService } from 'src/app/services/missions/missions.service';

@Component({
  selector: 'app-new-exemplaire',
  templateUrl: './new-exemplaire.component.html',
  styleUrls: ['./new-exemplaire.component.scss']
})
export class NewExemplaireComponent implements OnInit {
  exemplaire : IExemplaireDocument = {
    id: '',
    idDocument: '',
    titre: '',
    description: '',
    missions: [],
    attributs: []
  };
  forme: FormGroup;
  btnLibelle: string="Ajouter";
  titre: string="Ajouter un nouvel exemplaire de document";
  submitted: boolean=false;
  //_exemplaireDocument :  FormArray | undefined;

  constructor(private router:Router, private formBuilder: FormBuilder, private infosPath:ActivatedRoute, private serviceDocument:DocumentService, private serviceExemplaire : ExemplaireDocumentService, private serviceMission:MissionsService, private serviceAttribut:AttributService) { 
    this.forme = this.formBuilder.group({
      _exemplaireDocument :  new FormArray([])
    });
  }

  ngOnInit(): void {
    this.serviceExemplaire.getExemplaireDocumentById("1").subscribe(
      objet => {
        this.exemplaire = objet
        this.exemplaire.attributs.forEach(
          a => {
            const _exemplaireDocument = (this.forme.controls['_exemplaireDocument'] as FormArray);
            _exemplaireDocument.push(new FormControl())
          }
        )
      }
    )
  }
  get f(){
    return this.forme.controls;
  }
  onSubmit(exemplaireInput:any){
//    const _missionsSelected = (this.forme.get('_missions') as FormArray);
    this.submitted=true;
    if(this.forme.invalid) return;
    let exemplaireTemp : IExemplaireDocument={
      id: '9',
      idDocument: exemplaireInput.idDocument,
      titre: exemplaireInput.titre,
      description: exemplaireInput.description,
      missions: [],
      attributs: []
    }
    this.serviceDocument.ajouterDocument(exemplaireTemp).subscribe(
      object => {
    }
    )
  }
}
