import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IAttributs } from 'src/app/modele/attributs';
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
  
  attribut : IAttributs = {
    id: '',
    titre: '',
    description: '',
    etat: false,
    dateCreation: new Date,
    dateModification: new Date,
    ordre: 0,
    obligatoire: false,
    valeursParDefaut: '',
    type: TypeTicket.Int
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
  
  // tableau de type map pour enregistrer les index (en valeur)
  // et idAttributs (en clé) des controls du formulaire
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
  totalAttribut: number = -1
  tableauIndex : number[] = []

  constructor(private router:Router, private formBuilder: FormBuilder, private infosPath:ActivatedRoute,
     private serviceDocument:DocumentService, private serviceExemplaire : ExemplaireDocumentService,
      private datePipe : DatePipe, private serviceAttribut:AttributService) { 

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

  addAttributs(valParDefaut : any) {
    if(valParDefaut !='' && valParDefaut!='PARCOURS_NOT_FOUND_404')
      this._exemplaireDocument.push(this.formBuilder.control(valParDefaut));
    else
     this._exemplaireDocument.push(this.formBuilder.control(''));  
  }

  initialiseFormExemplaire(){

    this.tmpIndexValeursControls = new Map()

    if((this.idExemplaire != null) && this.idExemplaire !==''){
      this.btnLibelle="Modifier";
      this.titre="Document à Modifier";
      this.serviceExemplaire.getExemplaireDocumentById(this.idExemplaire).subscribe(
        x => {
          this.exemplaire = x;    
          this.document = x;   
          if(x.attributs.length > x.objetEnregistre.length)
            this.totalAttribut = x.attributs.length-1;
          else
          this.totalAttribut =  x.objetEnregistre.length-1;               
      });
    }
    if(this.idDocument){
      this.serviceDocument.getDocumentById(this.idDocument).subscribe(
        document =>{
          this.document = document
          this.totalAttribut = document.attributs.length-1;
        }
      )
    }
  }

  /**
   * methode permettant de renvoyer la valeur de l'attribut
   */
  rechercherValeurParIdAttribut(idAttribut : string) : string{

    for (let index = 0; index < this.exemplaire.objetEnregistre.length; index++) {
      const element = this.exemplaire.objetEnregistre[index];
      if(element.key == idAttribut){
        return element.value;
      }
    }
    return 'PARCOURS_NOT_FOUND_404';
  }
/**
 * Methode qui permet d'enregistrer les valeurs du formulaire dans un objet de type ObjetCleValeur
 * C'est set objet qui nous permettra de preremplir le formulaire lors de la modification
 */
  enregistrerObjet(){ 
    const exemplaireDocument = this._exemplaireDocument;
    this.exemplaire.objetEnregistre = []
      this.document.attributs.forEach(
        a => {
          const objetCleValeur : ObjetCleValeur={
            key: "",
            value: ""
          }
          const index = this.document.attributs.indexOf(a)
          objetCleValeur.key = a.id
          objetCleValeur.value = exemplaireDocument.controls[index].value
          this.exemplaire.objetEnregistre.push(objetCleValeur)
        }
      )
  }
  /**
   * recuperation du formArray qui servira pour l'enregistrement des donnees
   */
  get _exemplaireDocument(): FormArray {
    return this.formeExemplaire.get('_exemplaireDocument') as FormArray;
  }
  
  /**
   * methode qui permet d'extraire le premier element d'une chaine de caractere
   * Elle permettra d'afficher les valeurs par defaut des attributs un a un
   * @param chaine 
   */
  couperLaChaine(chaine : string){
    chaine.slice
  }

  /**
   * Permet d'incrémenter les index des différents inputs contenus dans les formControl
   * ainsi que de les initialiser à une valeur par défaut
   * @param cpt valeur courante du compteur
   * @param idAttribut id attribut à afficher
   * @returns valeur courante + 1
   */
  incrementeCompteur(cpt : number, attribut : IAttributs) : number{
    if(this.totalAttribut>-1 && this.compteur>=this.totalAttribut)
      return cpt;
    
    let valAttribut = this.rechercherValeurParIdAttribut(attribut.id);
    if (attribut.type == TypeTicket.Date &&  valAttribut != null) { // si le type de l'attribut est Date et que la valeur de valAttribut n'est pas vide
      let date = new Date(valAttribut) // creatoion d'une nouvelle date avec la valeur de valAttribut 
      let dateReduite = this.datePipe.transform(date,'yyyy-MM-dd') // changer le format de la date de naissance pour pouvoir l'afficher dans mon input type date
      this.addAttributs(dateReduite);
    }else{
      this.addAttributs(valAttribut);
    }
    this.compteur = this.compteur + 1
      return this.compteur
  }

  /**
   * methode de validation du formulaire (enregistrement des donnees du formulaire)
   */
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
