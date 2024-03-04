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
import { IFamille } from 'src/app/modele/famille';
import { FamillesService } from 'src/app/services/familles/familles.service';
import { DonneesEchangeService } from 'src/app/services/donnees-echange/donnees-echange.service';
import { TypeUnite } from 'src/app/modele/type-unite';
import { MatTableDataSource } from '@angular/material/table';
import { ModalCodebarreService } from '../../shared/modal-codebarre/modal-codebarre.service';

@Component({
  selector: 'app-new-ressource',
  templateUrl: './new-ressource.component.html',
  styleUrls: ['./new-ressource.component.scss'],
})
export class NewRessourceComponent implements OnInit {
  ressource: IRessource | undefined;
  forme: FormGroup;
  btnLibelle: string = 'Ajouter';
  submitted: boolean = false;
  unites: String[] = [];
  IdRessource: string = '';
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
    private dataDocumentCodebarre: DonneesEchangeService,
    private barService: ModalCodebarreService,
    private familleService: FamillesService,
    private ressourceService: RessourcesService,
    private serviceRessource: RessourcesService,
    private serviceFamille: FamillesService,
    private router: Router,
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
      caracteristique: [''],
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
            caracteristique: this.ressource.caracteristique,
            scanBarcode: this.ressource?.scanBarCode,
          });
      });
    }
    this.familleService.getTypeUnite().subscribe((u) => {
      this.unites = u.type;
    });
    this.titre = this.dataEnteteMenuService.dataEnteteMenu;
  }

  get f() {
    return this.forme.controls;
  }

  onSubmit(ressourceInput: any) {
    this.submitted = true;

    if (this.forme.invalid) return;
    let ressourceTemp: IRessource = {
      id: uuidv4(),
      libelle: ressourceInput.libelle,
      etat: ressourceInput.etat,
      quantite: ressourceInput.quantite,
      unite: ressourceInput.unite,
      prixEntree: ressourceInput.prixEntree,
      prixDeSortie: ressourceInput.prixDeSortie,
      famille: ressourceInput.famille,
      caracteristique: ressourceInput.caracteristique,
      scanBarCode: this.forme.get('scanBarcode')?.value,
    };

    if(this.ressource != undefined){
      ressourceTemp.id = this.ressource.id
    }
    ressourceTemp.famille = this.familleDeRessource;
    this.ressourceService
      .ajouterRessource(ressourceTemp)
      .subscribe((object) => {
        this.router.navigate(['list-ressources']);
      });
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
