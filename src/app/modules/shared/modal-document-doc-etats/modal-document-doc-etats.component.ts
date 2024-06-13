import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { IDocEtats } from 'src/app/modele/doc-etats';
import { IEtats } from 'src/app/modele/etats';
import { DonneesEchangeService } from 'src/app/services/donnees-echange/donnees-echange.service';
import { EtatService } from 'src/app/services/etats/etats.service';
import { ModalRoleValidationComponent } from '../modal-role-validation/modal-role-validation.component';
import { IValidation } from 'src/app/modele/validation';

@Component({
  selector: 'app-modal-doc-etats',
  templateUrl: './modal-document-doc-etats.component.html',
  styleUrls: ['./modal-document-doc-etats.component.scss']
})
export class ModalDocEtatsComponent implements OnInit{
  formeDocEtats: FormGroup;
  etatControl = new FormControl<string | IEtats>('');
  filteredOptions: IEtats[] | undefined;
  ELEMENTS_TABLE_DOC_ETATS: IDocEtats[] = [];
  dataSourceDocEtats = new MatTableDataSource<IDocEtats>(this.ELEMENTS_TABLE_DOC_ETATS);
  displayedDocEtatsColumns: string[] = [
    'actions',
    'libelle',
    'validation',
    'EtatPrecedant'
  ]; // structure du tableau presentant les doc etats
  selected: boolean=false;
  etatExiste: boolean=false;
  idDOCEtat : string = ""
  
  constructor(
    private serviceEtat: EtatService,
    private _liveAnnouncer: LiveAnnouncer,
    private formBuilder: FormBuilder,
    private donneeDocEtatService:DonneesEchangeService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router:Router, private dialogDef : MatDialog
  ) {
      this.formeDocEtats = this.formBuilder.group({});
    }

  ngOnInit(): void {
    this.serviceEtat.getAllEtats().subscribe(
      (resultat) =>{
        this.filteredOptions = resultat
      }
    )
    this.ELEMENTS_TABLE_DOC_ETATS = this.donneeDocEtatService.dataDocumentEtats;
    this.dataSourceDocEtats.data = this.ELEMENTS_TABLE_DOC_ETATS;
    
    this.etatControl.valueChanges.subscribe((value) => {
      const libelle = typeof value === 'string' ? value : value?.libelle;
      if (libelle != undefined && libelle?.length > 0) {
        this.serviceEtat
          .getEtatByLibelle(libelle.toLowerCase() as string)
          .subscribe((reponse) => {
            this.filteredOptions = reponse;
          });
      } else {
        this.filteredOptions = [];
        this.serviceEtat.getAllEtats().subscribe(
          (resultat) =>{
            this.filteredOptions = resultat
          }
        )
      }
    });
  }

  public rechercherListingEtat(option: IEtats) {
    this.selected = true;
    this.etatExiste = false;
    let tabIdEtats : string[] = []
    this.ELEMENTS_TABLE_DOC_ETATS.forEach(
      docEtat => {
        if ((docEtat.etat.id == option.id) ) {
          tabIdEtats.push(docEtat.etat.id)
        }
    });

    for (let index = 0; index < this.ELEMENTS_TABLE_DOC_ETATS.length; index++) {
      const element = this.ELEMENTS_TABLE_DOC_ETATS[index];
      if (element.etat.id == option.id) {
        this.etatExiste = true;
        break
      }
    }
    if (!tabIdEtats.includes(option.id)) {
      let docEtat : IDocEtats = {
        id: option.id,
        etat: option,
        ordre: 0,
        dateCreation: new Date()
      }
      this.ELEMENTS_TABLE_DOC_ETATS.push(docEtat)
      this.dataSourceDocEtats.data = this.ELEMENTS_TABLE_DOC_ETATS
      this.selected=false;
    }
  }

  get f(){
    return this.formeDocEtats.controls;
  }

  getIdDocEtat(idDocEtat : string){
    this.idDOCEtat = idDocEtat
  }

  displayFn(preco: IEtats): string {
    return preco && preco.libelle ? preco.libelle : '';
  }

  retirerSelectionEtat(index: number) {
    this.ELEMENTS_TABLE_DOC_ETATS = this.dataSourceDocEtats.data;
    this.ELEMENTS_TABLE_DOC_ETATS.splice(index, 1); // je supprime un seul element du tableau a la position 'index'
    this.dataSourceDocEtats.data = this.ELEMENTS_TABLE_DOC_ETATS;
  }

  /**
   * Methode qui permet d'effacer la valeur du control etat lorsqu'on a
   * déjà choisi l'etat en cliquant dessus
   */
  reinitialliseRessourceControl(){
    this.serviceEtat.getAllEtats().subscribe(
      (resultat) =>{
        this.filteredOptions = resultat
      }
    )
    this.etatControl.reset()
  }
  /**
   * Methode permettant d'ouvrir la modal de manipullation des etats du document
   */
  openRoleValidationDialog(){

    const dialogRef = this.dialogDef.open(ModalRoleValidationComponent,
    {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      enterAnimationDuration:'1000ms',
      exitAnimationDuration:'1000ms',
      data:{}
    }
    )

    dialogRef.afterClosed().subscribe(result => {
      for (let index = 0; index < this.ELEMENTS_TABLE_DOC_ETATS.length; index++) {
        const element = this.ELEMENTS_TABLE_DOC_ETATS[index];
        
        if (element.id == this.idDOCEtat) {
          element.validation = this.donneeDocEtatService.dataRoleValidation
          this.dataSourceDocEtats.data = this.ELEMENTS_TABLE_DOC_ETATS
          break
        }
      }
    });
  }
  /**
   * Methode qui permet d'injecter une donnée du service de sorte à initialiser
   * le control de choix de validation de la modale avec la valeur de la validation du docEtat
   * sur lequel on clique
   * @param validation valeur à injecter au service
   */
  initialiseValidationControl(validation : IValidation){
    this.donneeDocEtatService.dataRoleValidation = validation
  }
  /**
   * Methode permettant de ressportir le tableau des etats ayant supprimé l'etat courrant de sorte à ne pas le 
   * choisir en tant que état précédant
   * @param index index de l'etat courrant 
   */
  effaceEtatCourrant(etats : IDocEtats) : IDocEtats[] {
    let etatsFinal : IDocEtats[] = []
    this.ELEMENTS_TABLE_DOC_ETATS.forEach(
      element => {
        if (etats.etat.libelle != element.etat.libelle) {
          etatsFinal.push(element)
        }
    });
    return etatsFinal
  }
}
