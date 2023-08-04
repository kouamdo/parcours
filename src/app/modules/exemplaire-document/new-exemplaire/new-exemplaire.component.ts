import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IDocument } from 'src/app/modele/document';
import { IExemplaireDocument } from 'src/app/modele/exemplaire-document';
import { ObjetCleValeur } from 'src/app/modele/objet-cle-valeur';
import { TypeTicket } from 'src/app/modele/type-ticket';
import { AttributService } from 'src/app/services/attributs/attribut.service';
import { DocumentService } from 'src/app/services/documents/document.service';
import { ExemplaireDocumentService } from 'src/app/services/exemplaire-document/exemplaire-document.service';
import { MissionsService } from 'src/app/services/missions/missions.service';
import {v4 as uuidv4} from 'uuid';

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
    attributs: [],
    objetEnregistre: [],
    categories: []
  };
  document : IDocument = {
    id: '',
    titre: '',
    description: '',
    missions: [],
    attributs: [],
    categories: []
  }
  formeExemplaire: FormGroup;
  btnLibelle: string="Ajouter";
  titre: string="Ajouter un nouvel exemplaire de document";
  submitted: boolean=false;
  //_exemplaireDocument :  FormArray | undefined;
  controlExemplaire = new FormControl;
  typeAttribut : string = "";
  idDocument : string | null = "";
  idExemplaire : string | null = "";
  idPatientCourant: string | null= "";
  nomPatientCourant: string | null = "";
  
  typeInt = TypeTicket.Int;
  typeString = TypeTicket.String;
  typeDouble = TypeTicket.Double;
  typeFloat = TypeTicket.Float;
  typeBoolean = TypeTicket.Boolean;
  typeDate = TypeTicket.Date;
  TypeBoolean = TypeTicket.Boolean
  TypeRadio = TypeTicket.Radio

  constructor(private router:Router, private formBuilder: FormBuilder, private infosPath:ActivatedRoute, private serviceDocument:DocumentService, private serviceExemplaire : ExemplaireDocumentService, private serviceMission:MissionsService, private serviceAttribut:AttributService) { 
    this.formeExemplaire = this.formBuilder.group({
      _exemplaireDocument: new FormArray([])
    });
  }

  ngOnInit(): void {
    this.nomPatientCourant = sessionStorage.getItem("nomPatientCourant");

    // recuperation de l'id de l'exemplaire
    this.idExemplaire = this.infosPath.snapshot.paramMap.get('idExemplaire'); console.log("id de l'exemplaire ", this.idExemplaire);

    // recuperation de l'id du document
    this.idDocument = this.infosPath.snapshot.paramMap.get('idDocument'); console.log("l'id du document", this.idDocument);

    if((this.idExemplaire != null) && this.idExemplaire !==''){
      this.btnLibelle="Modifier";
      this.titre="Document à Modifier";
      this.serviceExemplaire.getExemplaireDocumentById(this.idExemplaire).subscribe(
        x => {
          this.exemplaire = x; console.log(this.exemplaire);
          const exemplaireDocument = this._exemplaireDocument;
          this.serviceDocument.getDocumentById(this.exemplaire.idDocument).subscribe(
            document =>{
              this.document = document
            }
          )
          this.exemplaire.objetEnregistre.forEach(
            element => {
              // let valueControl = new FormControl()
              // valueControl.setValue(element.value)
              // this._exemplaireDocument.push(valueControl)
              
              this.addAttributs()
              
              const index = this.exemplaire.objetEnregistre.indexOf(element)
              this._exemplaireDocument.controls[index].setValue(element.value)
          });
        console.log("l'exemplaire est : ", this.exemplaire); 
        console.log("les controles du formulaire de l'exemplaire sont : ", this._exemplaireDocument.controls.values);   
      });
    }
    if(this.idDocument){
      this.serviceDocument.getDocumentById(this.idDocument).subscribe(
        document =>{
          this.document = document
          document.attributs.forEach(
            x => {
              this.addAttributs()
              const objetCleValeur : ObjetCleValeur={
                key: "",
                value: ""
              }
              objetCleValeur.key = x.id
              this.exemplaire.objetEnregistre.push(objetCleValeur)
            }
          )
        }
      )
    }
  }

  addAttributs() {
    this._exemplaireDocument.push(this.formBuilder.control(''));
  }

  enregistrerObjet(){
    const exemplaireDocument = this._exemplaireDocument;
      this.document.attributs.forEach(
        a => {
          const objetCleValeur : ObjetCleValeur={
            key: "",
            value: ""
          }
          const index = this.document.attributs.indexOf(a)
          objetCleValeur.key = a.id
          objetCleValeur.value = exemplaireDocument.controls[index].value
          console.log('id de atr ', a.id);
        this.exemplaire.objetEnregistre.push(objetCleValeur)
        }
      )
  }
  get _exemplaireDocument() {
    return this.formeExemplaire.get('_exemplaireDocument') as FormArray;
  }
  get f(){
    return this.formeExemplaire.controls;
  }

  /**
   * methode qui permet d'extraire le premier element d'une chaine de caractere
   * Elle permettra d'afficher les valeurs par defaut des attributs un a un
   * @param chaine 
   */
  couperLaChaine(chaine : string){
    chaine.slice
  }
  onSubmit(exemplaireInput:any){
    const exemplaireDocument = this._exemplaireDocument;
    console.log('Exemplaire ', exemplaireDocument.value);
    console.log('Exemplaire keys ', this.exemplaire.objetEnregistre);
    this.submitted=true;
    if(this.formeExemplaire.invalid) return;

    let exemplaireTemp : IExemplaireDocument={
      id: uuidv4(),
      idDocument: this.document.id,
      titre: this.document.titre,
      description: this.document.description,
      missions: [],
      attributs: [],
      objetEnregistre: [],
      categories: this.document.categories
    }
    exemplaireTemp.objetEnregistre = this.exemplaire.objetEnregistre
    
    console.log("les objets cles-valeur : " + exemplaireTemp.objetEnregistre[0].key)
    console.log("l'id du document' : " + exemplaireTemp.idDocument)
    this.serviceExemplaire.ajouterExemplaireDocument(exemplaireTemp).subscribe(
      object => {
        this.router.navigate(['/list-exemplaire']);
    }
    )
  }
}
