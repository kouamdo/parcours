import { LiveAnnouncer } from '@angular/cdk/a11y';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { IExemplaireDocument } from 'src/app/modele/exemplaire-document';
import { IExemplairesDePersonne } from 'src/app/modele/exemplaires-de-personne';
import { IMouvement } from 'src/app/modele/mouvement';
import { IType } from 'src/app/modele/type';
import { TypeMouvement } from 'src/app/modele/typeMouvement';
import { DonneesEchangeService } from 'src/app/services/donnees-echange/donnees-echange.service';
import { ExemplaireDocumentService } from 'src/app/services/exemplaire-document/exemplaire-document.service';
import { PatientsService } from 'src/app/services/patients/patients.service';

@Component({
  selector: 'app-historique-par-personne',
  templateUrl: './historique-par-personne.component.html',
  styleUrls: ['./historique-par-personne.component.scss']
})
export class HistoriqueParPersonneComponent implements OnInit {

  nomPatientCourant: string | null = '';
  exemplaire : IExemplaireDocument = {
    id: '',
    titre: '',
    description: '',
    missions: [],
    attributs: [],
    idDocument: '',
    objetEnregistre: [],
    categories: [],
    preconisations: [],
    mouvements: [],
    etat: false,
    affichagePrix: false,
    contientRessources: false,
    contientDistributeurs: false,
    typeMouvement: TypeMouvement.Neutre,
    docEtats: [],
    dateCreation: new Date,
    personneRattachee: {
      id: '',
      nom: '',
      adresse: '',
      mail: '',
      telephone: '',
      qrCodeValue: ''
    }
  };
  titre:string='';
  mouvements : IMouvement[] = []
  typeNeutre : string = TypeMouvement.Neutre
  typeAjout : string = TypeMouvement.Ajout
  typeReduire : string = TypeMouvement.Reduire
  montantTotal: number = 0;
  displayedRessourcesColumns: string[] = [
    'libelle',
    'quantite',
    'unite',
    'description'
  ]; // structure du tableau presentant les Ressources
  dataSourceMouvements = new MatTableDataSource<IMouvement>();
  dataSourceAutresExemplaires = new MatTableDataSource<IExemplaireDocument>();
  filteredOptions: IExemplaireDocument[] | undefined;
  displayedColumns: string[] = ['titre'];
  @ViewChild(MatSort) sort!: MatSort;
  exemplairesDePersonne : IExemplairesDePersonne[] = [];
  DEFAULT_VALUE_TRI : string = "default";
  TRI_VALUE_DATE : string = "date";

  constructor(
    private router:Router, 
    private infosPath:ActivatedRoute,
    private serviceExemplaire:ExemplaireDocumentService,
    private datePipe: DatePipe,
    private _liveAnnouncer: LiveAnnouncer,
    private donneeExemplairePersonneRatacheeService:DonneesEchangeService,
    private decimalPipe : DecimalPipe,
    private servicePatient: PatientsService
    ) {}

  ngOnInit(): void {

    let idPersonne : string = this.donneeExemplairePersonneRatacheeService.getExemplairePersonneRatachee()
    this.servicePatient.getPatientById(idPersonne).subscribe(
      patientTrouve =>{
        this.exemplaire.personneRattachee =  patientTrouve;
      }
    )
    
    this.serviceExemplaire.getExemplaireDocumentByIdPersonneRatachee(idPersonne).subscribe(valeurs => {
      this.dataSourceAutresExemplaires.data = valeurs;
      idPersonne = valeurs[0].id
      this.exemplaire = valeurs[0];
      if (this.exemplaire.mouvements != undefined) {
        this.dataSourceMouvements.data = this.exemplaire.mouvements
      }
      this.formerEnteteTableauMissions();
      this.filteredOptions = valeurs
      this.regrouperExemplairesParType("default")
    });
  }
  /**
   * Methode permettant de formater les nombres afin d'y inserer un separateur de millers
   * @param nbr le nombre à transformer
   * @returns 
   */
    separateurDeMilliers(nbr:number) : string | null{
      return this.decimalPipe.transform(nbr)
    }

  /**
   * methode permettant de renvoyer la valeur de l'attribut
   */
  rechercherValeurParIdAttribut(idAttribut: string, typeAttribut: IType): string {
    for (
      let index = 0;
      index < this.exemplaire.objetEnregistre.length;
      index++
    ) {
      const element = this.exemplaire.objetEnregistre[index];
      if (element.key.id == idAttribut) {
        if (typeAttribut == IType.Date && element.value != undefined) {  // si le type de l'attribut est Date et que la valeur n'est pas vide
          let dateAtt = new Date();
          dateAtt = new Date(element.value); // creatoion d'une nouvelle date avec la valeur de valAttribut

          let dateReduite = this.datePipe.transform(dateAtt, 'dd-MM-yyyy'); // changer le format de la date de naissance pour pouvoir l'afficher dans mon input type date

          return dateReduite!
        }else if (element.value == undefined) {
          return "//"
        }
        return element.value;
      }
    }
    return '';
  }

  /**
   * Methode permettant de verifier si un attribut existe déjà dans les valeur enregistrées de l'exemplaire
   * afin de determiner s'il doit etre affiché dans la previsualisation 
   * @param idAttribut id de l'attribut à rechercher
   * @returns 
   */
  estEnregistrer(idAttribut : string) : boolean{
    let listIdAttrTemp : string[] = []
    this.exemplaire.objetEnregistre.forEach(element => {
      listIdAttrTemp.push(element.key.id)
    });
    if (!listIdAttrTemp.includes(idAttribut)) {
      return false
    }else
    return true

  }
  /**
   * Methodr qui permet de faire la somme des montants du tableau de mouvements
   * pour afficher le resultat dans la case montant total
   */
  sommeMontants(): number {
    this.montantTotal = 0;
    this.exemplaire.mouvements?.forEach((mouvement) => {
      if (
        mouvement.ressource != undefined &&
        mouvement.quantite != null &&
        mouvement.prix != null
      ) {
        this.montantTotal += mouvement.prix * mouvement.quantite;
      }
    });
    return this.montantTotal;
  }
  /**
   * Methode qui permet de rajouter les colones de prix et montants si affichePrix a la valeur true
   */
  formerEnteteTableauMissions(){
    if (this.exemplaire.contientDistributeurs == true) {
      let distributeur : string = "distributeur"
      this.displayedRessourcesColumns.push(distributeur)
    }
    if ((this.exemplaire.affichagePrix == true)) {
      let prix : string = "prix"
      let montant : string = "montant total"
      if (this.exemplaire.typeMouvement == TypeMouvement.Reduire) {
        prix = "prixDeSortie"
      } else if (this.exemplaire.typeMouvement == TypeMouvement.Ajout){
        prix = "prixEntrée"
      }else{
        prix = "prix"
      }
      this.displayedRessourcesColumns.push(prix)
      this.displayedRessourcesColumns.push(montant)
    }
  }
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
  /**
   * Methode permettant de trier le tableau des exemplaires de la personne afin de les 
   * regrouper par type(documents ayant le meme titre)
   */
  regrouperExemplairesParType(cleDeTri : string){
    this.exemplairesDePersonne = [];
    let tmpTabExemplaireTrier = new Map();
    for (let index = 0; index < this.dataSourceAutresExemplaires.data.length; index++) {
      const element = this.dataSourceAutresExemplaires.data[index];
      let cle : string =   element.titre;
      if(cleDeTri == this.TRI_VALUE_DATE)
        cle = element.dateCreation.toString().substring(0,10);

      if (!tmpTabExemplaireTrier.has(cle)) {
        let tabEltTraite : IExemplaireDocument[] = [];
        tabEltTraite.push(element);
        tmpTabExemplaireTrier.set(cle,tabEltTraite);
      }else{
        let tabEltTraite : IExemplaireDocument[] = tmpTabExemplaireTrier.get(cle);
        tabEltTraite.push(element);
        tmpTabExemplaireTrier.set(cle,tabEltTraite);
      }
    }
    tmpTabExemplaireTrier.forEach((value, key) => {
      let elt : IExemplairesDePersonne = {titre :key, exemplaires:value};
      this.exemplairesDePersonne.push(elt);        
    });

    this.exemplairesDePersonne.sort(this.comparerParNom)
  }

  /**
   * Methode permettant de trier le tableau des exemplaires de la personne afin de les 
   * regrouper par date
   */
  regrouperExemplairesParDate(){
      this.regrouperExemplairesParType("date");  
  }

  // Fonction de comparaison pour trier par la propriété 'nom'
  comparerParNom(a: IExemplairesDePersonne, b: IExemplairesDePersonne) {
    if (a.titre < b.titre) {
        return 1;
    }
    if (a.titre > b.titre) {
        return -1;
    }
    return 0;
}

  /**
   * Methode permettant de rafraîchir la section de la page presentant l'emplaire et de 
   * remplacer ce dernier par le document de la personne sur lequel on clique pour le visualiser
   * @param exemplaire : document recupéré pour etre visualisé
   */
  switchExemplaires(exemplaire : IExemplaireDocument){
    this.displayedRessourcesColumns = [
      'libelle',
      'quantite',
      'unite',
      'description'
    ];
    this.exemplaire = exemplaire
    
    this.formerEnteteTableauMissions();

    if (this.exemplaire.mouvements != undefined) {
      this.mouvements = this.exemplaire.mouvements
    }
    if (this.exemplaire.mouvements != undefined) {
      this.dataSourceMouvements.data = this.exemplaire.mouvements
    }

  }
}
