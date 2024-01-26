import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { IDocEtats } from 'src/app/modele/doc-etats';
import { IEtats } from 'src/app/modele/etats';
import { DonneesEchangeService } from 'src/app/services/donnees-echange/donnees-echange.service';
import { EtatService } from 'src/app/services/etats/etats.service';

@Component({
  selector: 'app-modal-doc-etats',
  templateUrl: './modal-doc-etats.component.html',
  styleUrls: ['./modal-doc-etats.component.scss']
})
export class ModalDocEtatsComponent {
  formeDocEtats: FormGroup;
  etatControl = new FormControl<string | IEtats>('');
  filteredOptions: IEtats[] | undefined;
  ELEMENTS_TABLE_DOC_ETATS: IDocEtats[] = [];
  dataSourceDocEtats = new MatTableDataSource<IDocEtats>(this.ELEMENTS_TABLE_DOC_ETATS);
  displayedDocEtatsColumns: string[] = [
    'actions',
    'libelle',
    'ordre'
  ]; // structure du tableau presentant les doc etats
  selected: boolean=false;
  ordreExiste: boolean=false;
  etatExiste: boolean=false;
  
  constructor(
    private serviceEtat: EtatService,
    private _liveAnnouncer: LiveAnnouncer,
    private formBuilder: FormBuilder,
    private donneeDocEtatService:DonneesEchangeService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router:Router
  ) {
      this.formeDocEtats = this.formBuilder.group({
        ordreDocEtats: ['', [Validators.required, Validators.minLength(1)]],
      });
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
    this.ordreExiste = false;
    this.etatExiste = false;
    let tabIdEtats : string[] = []
    this.ELEMENTS_TABLE_DOC_ETATS.forEach(
      docEtat => {
        if ((docEtat.etat.id == option.id) ) {
          tabIdEtats.push(docEtat.etat.id)
        }
    });
    let ordre : number = this.formeDocEtats.controls["ordreDocEtats"].value

    for (let index = 0; index < this.ELEMENTS_TABLE_DOC_ETATS.length; index++) {
      const element = this.ELEMENTS_TABLE_DOC_ETATS[index];
      if (element.ordre == ordre) {
        this.ordreExiste = true;
        break
      }
      if (element.etat.id == option.id) {
        this.etatExiste = true;
        break
      }
    }
    if ((!tabIdEtats.includes(option.id) && !this.ordreExiste) && (ordre != undefined && ordre != 0 && ordre > 0 )) {
      let docEtat : IDocEtats = {
        id: option.id,
        etat: option,
        ordre: ordre,
        dateCreation: new Date()
      }
      this.ELEMENTS_TABLE_DOC_ETATS.unshift(docEtat)
      this.dataSourceDocEtats.data = this.ELEMENTS_TABLE_DOC_ETATS
      this.selected=false;
    }
  }

  get f(){
    return this.formeDocEtats.controls;
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
   * Methode qui permet d'effacer la valeur des controls etat et ordre lorsqu'on a
   * déjà choisi l'etat en cliquant dessus
   */
  reinitialliseRessourceControl(){
    this.serviceEtat.getAllEtats().subscribe(
      (resultat) =>{
        this.filteredOptions = resultat
      }
    )
    this.etatControl.reset()
    this.formeDocEtats.controls["ordreDocEtats"].reset()
  }
}
