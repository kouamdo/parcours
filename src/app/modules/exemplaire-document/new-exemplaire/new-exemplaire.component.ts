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
  
  // tableau de type map pour enregistrer les index 
  // et valeurs des controls du formulaire
  tmpIndexValeursControls : Map<string, number> = new Map();
  
  typeInt = TypeTicket.Int;
  typeString = TypeTicket.String;
  typeDouble = TypeTicket.Double;
  typeFloat = TypeTicket.Float;
  typeBoolean = TypeTicket.Boolean;
  typeDate = TypeTicket.Date;
  TypeBoolean = TypeTicket.Boolean
  TypeRadio = TypeTicket.Radio

  compteur : number = -1
  tableauIndex : number[] = []

  constructor(private router:Router, private formBuilder: FormBuilder, private infosPath:ActivatedRoute, private serviceDocument:DocumentService, private serviceExemplaire : ExemplaireDocumentService, private serviceMission:MissionsService, private serviceAttribut:AttributService) { 
    this.formeExemplaire = this.formBuilder.group({
      _exemplaireDocument: new FormArray([])
    });
  }

  ngOnInit(): void {
    this.nomPatientCourant = sessionStorage.getItem("nomPatientCourant");
    this.compteur = -1
    this.tableauIndex = []
    // recuperation de l'id de l'exemplaire
    this.idExemplaire = this.infosPath.snapshot.paramMap.get('idExemplaire'); console.log("id de l'exemplaire ", this.idExemplaire);

    // recuperation de l'id du document
    this.idDocument = this.infosPath.snapshot.paramMap.get('idDocument'); console.log("l'id du document", this.idDocument);
    
    this.initialiseFormExemplaire()
  }

  addAttributs() {
   this._exemplaireDocument.push(this.formBuilder.control(''));
  }
  initialiseFormExemplaire(){

    this.tmpIndexValeursControls = new Map()

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
              document.attributs.forEach(
                x => {
                  this.addAttributs()

                  const indice = exemplaireDocument.length;
                  
                  exemplaireDocument.controls[0].setValue("ok")
                  console.log("le resultat est : ", exemplaireDocument.controls[0].value)
                  //creer la map avec id et indice
                  this.tmpIndexValeursControls.set(x.id, indice - 1);
                }
              )
            }
          )
          this.remplissageFormulaire()
          console.log("le tablesu : " , this.tmpIndexValeursControls)
      });
    }
    if(this.idDocument){
      this.serviceDocument.getDocumentById(this.idDocument).subscribe(
        document =>{
          this.document = document
          document.attributs.forEach(
            x => {
              this.addAttributs()
              // const objetCleValeur : ObjetCleValeur={
              //   key: "",
              //   value: ""
              // }
              // objetCleValeur.key = x.id
              // this.exemplaire.objetEnregistre.push(objetCleValeur)
            }
          )
        }
      )
    }
  }

  /**
   * methode permettant de preremplir le formulaire pour la modification
   */
  remplissageFormulaire(){// parcourir les indices de la map forme a ce niveau, listIndice

    console.log("la fonction de remplissage ")

    const exemplaireDocument = this._exemplaireDocument;
    console.log("le tablesu partie remplissage: " , this.tmpIndexValeursControls)

    for (let index = 0; index < this.exemplaire.objetEnregistre.length; index++) {
      const element = this.exemplaire.objetEnregistre[index];
      let indiceCourant : number | undefined = this.tmpIndexValeursControls.get(element.key)
      console.log("le get est : ", indiceCourant)
      if(this.tmpIndexValeursControls.get(element.key)){
        let indiceCourant : number | undefined = this.tmpIndexValeursControls.get(element.key)
        exemplaireDocument.controls[indiceCourant!].setValue(element.value)
        console.log("le resultat est : ", exemplaireDocument.controls[indiceCourant!].value)
        break;
      }
    }
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
          console.log('exemplaireDocument.controls[index].value ', exemplaireDocument.controls[index].value);
          console.log('id de atr ', a.id);
          this.exemplaire.objetEnregistre.push(objetCleValeur)

        // sauvegarde de l'indice et de la valeur du control
        //let indice : number = this.exemplaire.objetEnregistre.push(objetCleValeur)
        //this.tmpIndexValeursControls.set(exemplaireDocument.controls[index].value, indice-1);
        }
      )
  }
  get _exemplaireDocument(): FormArray {
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
  incrementeCompteur() : number{
      this.compteur = this.compteur + 1
      console.log('le compteur est : ', this.compteur)
      return this.compteur
  }
  onSubmit(){
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
    
    console.log("les objets cles-valeur : " + exemplaireTemp.objetEnregistre)
    console.log("this._exemplaireDocument : ", this._exemplaireDocument.value)

    if(this.exemplaire.id != ""){
      exemplaireTemp.id = this.exemplaire.id
    }

    this.serviceExemplaire.ajouterExemplaireDocument(exemplaireTemp).subscribe(
      object => {
        this.router.navigate(['/list-exemplaire']);
    }
    )
  }
}
