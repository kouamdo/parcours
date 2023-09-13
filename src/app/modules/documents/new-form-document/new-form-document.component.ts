import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, EMPTY } from 'rxjs';
import { IAttributs } from 'src/app/modele/attributs';
import { ICategoriesAttributs } from 'src/app/modele/categories-attributs';
import { IDocument } from 'src/app/modele/document';
import { IMission } from 'src/app/modele/mission';
import { IService } from 'src/app/modele/service';
import { AttributService } from 'src/app/services/attributs/attribut.service';
import { DocumentService } from 'src/app/services/documents/document.service';
import { MissionsService } from 'src/app/services/missions/missions.service';
import {MatDialog} from '@angular/material/dialog';
import { ModalCategoriesComponent } from '../../shared/modal-categories/modal-categories.component';
import {v4 as uuidv4} from 'uuid';
import { ICategorieAffichage } from 'src/app/modele/categorie-affichage';
import { TypeTicket } from 'src/app/modele/type-ticket';
import { DonneesEchangeService } from 'src/app/services/donnees-echange/donnees-echange.service';
import { ModalChoixAttributsComponent } from '../../shared/modal-choix-attributs/modal-choix-attributs.component';
import { ModalChoixPreconisationsComponent } from '../../shared/modal-choix-preconisations/modal-choix-preconisations.component';
import { IPrecoMvt } from 'src/app/modele/precomvt';


@Component({
  selector: 'app-new-form-document',
  templateUrl: './new-form-document.component.html',
  styleUrls: ['./new-form-document.component.scss']
})
export class NewFormDocumentComponent implements OnInit {
  
  document : IDocument = {
    id: '',
    titre: '',
    description: '',
    missions: [],
    attributs: [],
    categories: [],
    preconisations: []
  };
  mission$:Observable<IMission[]>=EMPTY;
  forme: FormGroup;
  btnLibelle: string="Ajouter";
  titre: string="Ajouter un nouveau document";
  submitted: boolean=false;
  validation: boolean=false;
  serviceDeMission!: IService;

  // variables attributs, pour afficher le tableau d'attributs sur l'IHM
  ELEMENTS_TABLE_ATTRIBUTS: IAttributs[] = [];
  dataSourceAttribut = new MatTableDataSource<IAttributs>(this.ELEMENTS_TABLE_ATTRIBUTS);
  dataSourceAttributResultat = new MatTableDataSource<IAttributs>();

   ELEMENTS_TABLE_CATEGORIES: IAttributs[] = []; //tableau de listing des attributs a affecter a chaque categorie

  // variables pour la gestion des categories
  categorieAttributs : ICategoriesAttributs = {
    id: '',
    nom: '',
    ordre: 0,
    listAttributs: []
  }
  TABLE_CATEGORIE_AFFICHAGE_TEMP: ICategoriesAttributs[] = []; // tableau qui doit contenir la synthese des categories du doc
  TABLE_CATEGORIE_AFFICHAGE_TEMPO: ICategorieAffichage[] = []; // tableau contenant les categories creees dans la modale

  //tableau contenent les preconisations
  ELEMENTS_TABLE_PRECONISATIONS: IPrecoMvt[] = [];

  
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private router:Router, private formBuilder: FormBuilder, private infosPath:ActivatedRoute,
     private serviceDocument:DocumentService, private serviceMission:MissionsService, private serviceAttribut:AttributService, 
      private _liveAnnouncer: LiveAnnouncer, private donneeDocCatService:DonneesEchangeService, private dialogDef : MatDialog) {
    this.forme = this.formBuilder.group({
      _missions :  new FormControl<string | IMission[]>(''),
      _attributs :  new FormArray([]),
      titre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      description: ['']
    });
  }
  ngOnInit(): void {
    this.mission$ = this.getAllMissions();

    // chargement de la page a partir d'un Id pour la modification d'un document
    let idDocument = this.infosPath.snapshot.paramMap.get('idDocument');
    if((idDocument != null) && idDocument!==''){
      this.btnLibelle="Modifier";
      this.titre="Document à Modifier";
      this.serviceDocument.getDocumentById(idDocument).subscribe(x =>
      {
        this.document = x;
        this.forme.setValue({
          titre: this.document.titre,
          description: this.document.description,
          _missions: this.document.missions,
          _attributs: []
          })
          this.forme.controls["_missions"].setValue(this.document.missions);

        // Initialisation du tableau d'attributs du document
        this.ELEMENTS_TABLE_ATTRIBUTS = this.document.attributs

        // Initialisation du tableau de preconisations du document
        this.ELEMENTS_TABLE_PRECONISATIONS = this.document.preconisations

        // Initialisation du tableau de categories temp du document qui reconstitue
        // le deuxieme tableau de la modal
        let categorieAfficheFinal : ICategorieAffichage[] = [];
        this.document.categories.forEach(
          catAttribut => {
            catAttribut.listAttributs.forEach(
              att => {
                let categorieAfficheTemp : ICategorieAffichage = {
                  id: '',
                  nom: '',
                  ordre: 0,
                  attribut: {
                    id: '',
                    titre: '',
                    description: '',
                    etat: false,
                    dateCreation: new Date(),
                    dateModification: new Date(),
                    ordre: 0,
                    obligatoire: false,
                    valeursParDefaut: '',
                    type: TypeTicket.Int
                  }
                }
                categorieAfficheTemp.id = catAttribut.id
                categorieAfficheTemp.nom = catAttribut.nom
                categorieAfficheTemp.ordre = catAttribut.ordre
                categorieAfficheTemp.attribut = att
                categorieAfficheFinal.push(categorieAfficheTemp)
              }
            )
          }
        )
        //sauvegarde dans le service pour le communiquer à la modale
        this.donneeDocCatService.dataDocumentCategorie = categorieAfficheFinal
        this.donneeDocCatService.dataDocumentPrecoMvts = this.document.preconisations
        this.donneeDocCatService.dataDocumentAttributs = this.document.attributs

        // synthese du tableau de categories du document pour afficher les differentes categories dans l'espace dedie
        this.syntheseCategorieAttribut()
      });
    }else{
      this.donneeDocCatService.dataDocumentAttributs = []
      this.donneeDocCatService.dataDocumentCategorie = []
      this.donneeDocCatService.dataDocumentPrecoMvts = []
    }
  }

  openCategorieDialog(){
    //envoi des données à la fenetre enfant

    const dialogRef = this.dialogDef.open(ModalCategoriesComponent, 
    {
      width:'100%',
      height:'100%',
      enterAnimationDuration:'1000ms',
      exitAnimationDuration:'1000ms',
      data:{}
    }
    )

    dialogRef.afterClosed().subscribe(result => {
      this.syntheseCategorieAttribut()
    });
  }

  openAttributDialog(){
    const dialogRef = this.dialogDef.open(ModalChoixAttributsComponent, 
    {
      width:'100%',
      height:'100%',
      enterAnimationDuration:'1000ms',
      exitAnimationDuration:'1000ms',
      data:{
        // tableauAttributsDocumentResultat : this.ELEMENTS_TABLE_ATTRIBUTS
      }
    }
    )

    dialogRef.afterClosed().subscribe(result => {
      this.ELEMENTS_TABLE_ATTRIBUTS =  this.donneeDocCatService.dataDocumentAttributs
    });
  }
  openPrecoMvtDialog(){

    const dialogRef = this.dialogDef.open(ModalChoixPreconisationsComponent, 
    {
      width:'100%',
      height:'100%',
      enterAnimationDuration:'1000ms',
      exitAnimationDuration:'1000ms',
      data:{
        // dataSourcePreco : this.dataSourcePreco
      }
    }
    )

    dialogRef.afterClosed().subscribe(result => {
      this.ELEMENTS_TABLE_PRECONISATIONS = this.donneeDocCatService.dataDocumentPrecoMvts
    });
  }

  /**
   * methode quiu permet de fusionner les categories en fontion du meme nom tout en regroupant leurs attributs
   * ceci permet de former le tableau d'objets ICategoriesAttriut qui sera rattache au document lors de l'enregistrement
   */
  syntheseCategorieAttribut(){
    let tmpCatAtt = new Map(); 
    let categorieAttributsFinal : ICategoriesAttributs[] = [];

    //récupération des données du service
    this.TABLE_CATEGORIE_AFFICHAGE_TEMPO = this.donneeDocCatService.dataDocumentCategorie;
    this.TABLE_CATEGORIE_AFFICHAGE_TEMPO.forEach(
      objet => {
        let categorieAttributTemp : ICategoriesAttributs = {
          id: '',
          nom: '',
          ordre: 0,
          listAttributs: []
        }
          //si la map ne contient pas la catégorie courante 
          if(tmpCatAtt.get(objet.nom)== null){
            categorieAttributTemp.id = objet.id;
            categorieAttributTemp.nom = objet.nom;
            categorieAttributTemp.ordre = objet.ordre;
            categorieAttributTemp.listAttributs.push(objet.attribut);

            // sauvegarde de l'indice de l'élément enregistré
            let index : number  = categorieAttributsFinal.push(categorieAttributTemp);
            tmpCatAtt.set(objet.nom, index-1);
          }
          else{
            //si la valeur est trouvée dans la map
            let index : number = tmpCatAtt.get(objet.nom); // récuperation de l'indice de l'élément enregistré
            categorieAttributTemp = categorieAttributsFinal[index];
            categorieAttributTemp.listAttributs.push(objet.attribut);
            categorieAttributsFinal[index] = categorieAttributTemp;
          }
        } 
    );
      this.TABLE_CATEGORIE_AFFICHAGE_TEMP = categorieAttributsFinal;
  }
  onSubmit(documentInput:any){
    this.submitted=true;
    if(this.forme.invalid || documentInput._missions.length<1 || this.ELEMENTS_TABLE_ATTRIBUTS.length<1) return;
    let documentTemp : IDocument={
      id: uuidv4(),
      titre: documentInput.titre,
      description: documentInput.description,
      missions: documentInput._missions,
      attributs: [],
      categories: [],
      preconisations: []
    }
    
    if(this.document.id != ""){
      documentTemp.id = this.document.id  
    }
    
    this.ELEMENTS_TABLE_ATTRIBUTS.forEach(
      a => documentTemp.attributs.push(a)
    )

    this.ELEMENTS_TABLE_PRECONISATIONS.forEach(
      preco => documentTemp.preconisations.push(preco)
    )
    if (this.TABLE_CATEGORIE_AFFICHAGE_TEMP.length<1) {
      let categorieAttributs : ICategoriesAttributs = {
        id: '',
        nom: "Autres",
        ordre: 100,
        listAttributs: []
      }
      this.ELEMENTS_TABLE_ATTRIBUTS.forEach(
        element => {
          categorieAttributs.listAttributs.push(element)
      });
      // ajout d'une categorie par defaut dans le document
      documentTemp.categories.push(categorieAttributs)
    }else{
      this.TABLE_CATEGORIE_AFFICHAGE_TEMP.forEach(
        cat => documentTemp.categories.push(cat)
      )
    }

    this.serviceDocument.ajouterDocument(documentTemp).subscribe(
      object => {
        this.router.navigate(['/list-documents']);
      }
    )
    this.donneeDocCatService.dataDocumentAttributs = []
    this.donneeDocCatService.dataDocumentCategorie = []
    this.donneeDocCatService.dataDocumentPrecoMvts = []
  }
  get f(){
    return this.forme.controls;
  }
  private getAllMissions(){
    return this.serviceMission.getAllMissions();
  }
  compareItem(mission1: IMission, mission2: IMission) {
    return mission2 && mission1 ? mission2.id === mission1.id : mission2 === mission1;
  }
}

