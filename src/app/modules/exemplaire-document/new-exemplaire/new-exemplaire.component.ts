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
  formeExemplaire: FormGroup;
  btnLibelle: string="Ajouter";
  titre: string="Ajouter un nouvel exemplaire de document";
  submitted: boolean=false;
  //_exemplaireDocument :  FormArray | undefined;
  controlExemplaire = new FormControl;

  constructor(private router:Router, private formBuilder: FormBuilder, private infosPath:ActivatedRoute, private serviceDocument:DocumentService, private serviceExemplaire : ExemplaireDocumentService, private serviceMission:MissionsService, private serviceAttribut:AttributService) { 
    this.formeExemplaire = this.formBuilder.group({
      _exemplaireDocument: this.formBuilder.array([
      ])
    });
  }

  ngOnInit(): void {
    this.serviceExemplaire.getExemplaireDocumentById("1").subscribe(
      objet => {
        this.exemplaire = objet
        objet.attributs.forEach(
          x => {this.addAttributs()}
        )
      }
    )
  }

  addAttributs() {
    this._exemplaireDocument.push(this.formBuilder.control(''));
  }
  get _exemplaireDocument() {
    return this.formeExemplaire.get('_exemplaireDocument') as FormArray;
  }
  get f(){
    return this.formeExemplaire.controls;
  }
  onSubmit(exemplaireInput:any){
    const exemplaireDocument = this._exemplaireDocument;
    console.log('Exemplaire ', exemplaireDocument.value);
    this.submitted=true;
    if(this.formeExemplaire.invalid) return;
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
