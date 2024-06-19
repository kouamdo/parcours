import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IRessource } from 'src/app/modele/ressource';
import { RessourcesService } from 'src/app/services/ressources/ressources.service';
import { v4 as uuidv4 } from 'uuid';
import { EMPTY, Observable, scan } from 'rxjs';
import { IAttributs } from 'src/app/modele/attributs';
import { IFamille } from 'src/app/modele/famille';
import { FamillesService } from 'src/app/services/familles/familles.service';
import { DonneesEchangeService } from 'src/app/services/donnees-echange/donnees-echange.service';
import { TypeUnite } from 'src/app/modele/type-unite';
import { MatTableDataSource } from '@angular/material/table';
import { ModalCodebarreService } from '../../shared/modal-codebarre/modal-codebarre.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalRessourceAttributsComponent } from '../../shared/modal-ressource-attributs/modal-ressource-attributs.component';

@Component({
  selector: 'app-new-ressource',
  templateUrl: './new-ressource.component.html',
  styleUrls: ['./new-ressource.component.scss'],
})
export class NewRessourceComponent implements OnInit {
  ressource: IRessource | undefined;
  forme: FormGroup;
  btnLibelle: string="Enregistrer";
  submitted: boolean=false;
  unites : String[] = [];
  IdRessource:string= ""
  ELEMENTS_TABLE_ATTRIBUTS_SELECT: any[] = [];
  filteredOptions: IFamille[] | undefined;
  dataSource = new MatTableDataSource<IFamille>();
  familleDeRessource: IFamille = {
    id: '',
    libelle: '',
    description: '',
    etat: false,
  };
  titre: string = '';
  scan_val: any | undefined;
  constructor(
    private formBuilder: FormBuilder,
    private dataEnteteMenuService: DonneesEchangeService,
    private barService: ModalCodebarreService,
    private familleService: FamillesService,
    private ressourceService: RessourcesService,
    private serviceRessource: RessourcesService,
    private serviceFamille: FamillesService,
    private router: Router,
    private dialogDef : MatDialog,
    private infosPath: ActivatedRoute,
    private datePipe: DatePipe
  ) {
    this.forme = this.formBuilder.group({
      libelle: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      etat: [true],
      quantite: ['', [Validators.required]],
      unite: ['', [Validators.required]],
      prixEntree: ['', [Validators.required]],
      prixDeSortie: ['', [Validators.required]],
      famille: new FormControl<string | IFamille>(''),
      scanBarcode: [''],
    });
  }

  ngOnInit(): void {
    this.barService.getCode().subscribe((dt) => {
      this.scan_val = dt;
      this.forme.get('scanBarcode')?.setValue(dt);
    });
    this.serviceFamille.getAllFamilles().subscribe((reponse) => {
      this.filteredOptions = reponse;
    });
    this.forme.controls['famille'].valueChanges.subscribe((value) => {
      const libelle = typeof value === 'string' ? value : value?.libelle;
      if (libelle != undefined && libelle?.length > 0) {
        this.serviceFamille
          .getFamillesByLibelle(libelle.toLowerCase() as string)
          .subscribe((reponse) => {
            this.filteredOptions = reponse;
          });
      } else {
        this.serviceFamille.getAllFamilles().subscribe((reponse) => {
          this.filteredOptions = reponse;
        });
      }
    });
    let idRessource = this.infosPath.snapshot.paramMap.get('idRessource');
    if (idRessource != null && idRessource !== '') {
      this.btnLibelle = 'Modifier';
      this.ressourceService.getRessourceById(idRessource).subscribe((x) => {
        this.ressource = x;
        (this.ressource.id = idRessource!),
          this.forme.setValue({
            libelle: this.ressource.libelle,
            etat: this.ressource.etat,
            quantite: this.ressource.quantite,
            unite: this.ressource.unite,
            prixEntree: this.ressource.prixEntree,
            prixDeSortie: this.ressource.prixDeSortie,
            famille: this.ressource.famille,
            scanBarcode: this.ressource?.scanBarCode,
          });
          if (this.ressource.caracteristiques != undefined) {
            this.ELEMENTS_TABLE_ATTRIBUTS_SELECT = this.ressource.caracteristiques
          }
          this.dataEnteteMenuService.dataDocumentRessourcesAttributs = this.ELEMENTS_TABLE_ATTRIBUTS_SELECT;
      });
    } else {
      this.dataEnteteMenuService.dataDocumentRessourcesAttributs = []
    }
    this.familleService.getTypeUnite().subscribe((u) => {
      this.unites = u.type;
    });
    this.titre = this.dataEnteteMenuService.dataEnteteMenu;
  }

  get f() {
    return this.forme.controls;
  }

  /**
   * Methode permettant d'ouvrir la modal de selection des attributs de la ressource
   */
  openAttributDialog(){
    this.dataEnteteMenuService.dataDocumentRessourcesAttributs = this.ELEMENTS_TABLE_ATTRIBUTS_SELECT;

    const dialogRef = this.dialogDef.open(ModalRessourceAttributsComponent,
    {
      width:'100%',
      height:'100%',
      enterAnimationDuration:'1000ms',
      exitAnimationDuration:'1000ms'
    }
    )

    dialogRef.afterClosed().subscribe(result => {
      this.ELEMENTS_TABLE_ATTRIBUTS_SELECT =  this.dataEnteteMenuService.dataDocumentRessourcesAttributs      
    });
    
  }

  onSubmit(ressourceInput:IRessource){
    this.submitted=true;
    if(this.forme.invalid) return console.log("error azertyuiop", this.forme.invalid);

    let styleAtt : any = this.ELEMENTS_TABLE_ATTRIBUTS_SELECT;

    let ressourceTemp : IRessource={
      id: uuidv4(),
      libelle: ressourceInput.libelle,
      etat: ressourceInput.etat,
      quantite: ressourceInput.quantite,
      unite: ressourceInput.unite,
      prixEntree: ressourceInput.prixEntree,
      prixDeSortie: ressourceInput.prixDeSortie,
      famille: ressourceInput.famille,
      caracteristiques: styleAtt,
      scanBarCode: this.forme.get('scanBarcode')?.value,
    };

    if(this.ressource != undefined){
      ressourceTemp.id = this.ressource.id
    }
    this.ressourceService
      .ajouterRessource(ressourceTemp)
      .subscribe((object) => {
        this.router.navigate(['list-ressources']);
      }
    )
    this.dataEnteteMenuService.dataDocumentRessourcesAttributs = []

  }

  displayFn(famille: IFamille): string {
    return famille && famille.libelle ? famille.libelle : '';
  }

  private getAllRessources() {
    return this.serviceRessource.getAllRessources();
  }

  compareItem(unite1: string, unite2: string) {
    return unite2 && unite1 ? unite2 == unite1 : false;
  }
}
