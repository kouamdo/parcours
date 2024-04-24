import { LiveAnnouncer } from '@angular/cdk/a11y';
import {
  FormControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { IAttributs } from 'src/app/modele/attributs';
import { AttributService } from 'src/app/services/attributs/attribut.service';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { DonneesEchangeService } from 'src/app/services/donnees-echange/donnees-echange.service';
import { log } from 'console';
import { IRessource } from 'src/app/modele/ressource';
import { IType } from 'src/app/modele/type';

@Component({
  selector: 'app-modal-ressource-attributs',
  templateUrl: './modal-ressource-attributs.component.html',
  styleUrls: ['./modal-ressource-attributs.component.scss'],
})
export class ModalRessourceAttributsComponent implements OnInit {
  // variables attributs, pour afficher le tableau d'attributs sur l'IHM
  formeAttribut: FormGroup;
  submitted: boolean = false;
  valid: boolean = true;
  datas: any[] = [];
  verif: boolean = false;
  ressources: IRessource = {
    id: '',
    libelle: '',
    etat: false,
    quantite: 0,
    prixEntree: 0,
    prixDeSortie: 0,
    unite: '',
    famille: {
      id: '',
      libelle: '',
      description: '',
      etat: false,
    },
  };
  myControl = new FormControl<string | IAttributs>('');
  ELEMENTS_TABLE_ATTRIBUTS: any[] = [];
  STORE_ELEMENTS_ATTRIBUTS: any[] = [];
  filteredOptions: IAttributs[] | undefined;
  displayedAttributsColumns: string[] = [
    'actions',
    'titre',
    'description',
    'type',
  ]; // structure du tableau presentant les attributs
  displayedResultAttributsColumns: string[] = [
    'actions',
    'titre',
    'type',
    'valeur',
  ];
  dataSourceAttribut = new MatTableDataSource<IAttributs>(
    this.ELEMENTS_TABLE_ATTRIBUTS
  );
  dataSourceAttributResultat = new MatTableDataSource<any>();
  idAttribut: string = '';
  attRes : IAttributs = {
    id: '',
    titre: '',
    description: '',
    etat: false,
    dateCreation: new Date(),
    dateModification: new Date(),
    valeursParDefaut: '',
    type: IType.Int,
  } 
  att = {
    attribut : this.attRes,
    Valeur : ""
}

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private infosPath: ActivatedRoute,
    private serviceAttribut: AttributService,
    private _liveAnnouncer: LiveAnnouncer,
    private donneeDocCatService: DonneesEchangeService,
    private dialogDef: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.formeAttribut = this.formBuilder.group({
      res: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getAllAttributs().subscribe((valeurs) => {
      this.dataSourceAttribut.data = valeurs;
      this.filteredOptions = valeurs;
    });

    if (this.donneeDocCatService.dataDocumentAttributs.length > 0) {
      this.ELEMENTS_TABLE_ATTRIBUTS = this.donneeDocCatService.dataDocumentAttributs;
      this.dataSourceAttributResultat.data = this.ELEMENTS_TABLE_ATTRIBUTS;
      this.STORE_ELEMENTS_ATTRIBUTS = this.ELEMENTS_TABLE_ATTRIBUTS;
      this.valid = false;
      console.log(
        'resultats tb :',
        this.STORE_ELEMENTS_ATTRIBUTS, this.donneeDocCatService.dataDocumentAttributs, this.valid
      );
    }

    this.myControl.valueChanges.subscribe((value) => {
      const titre = typeof value === 'string' ? value : value?.titre;
      if (titre != undefined && titre?.length > 0) {
        this.serviceAttribut
          .getAttributsByTitre(titre.toLowerCase() as string)
          .subscribe((reponse) => {
            this.filteredOptions = reponse;
          });
      } else {
        this.serviceAttribut.getAllAttributs().subscribe((reponse) => {
          this.filteredOptions = reponse;
        });
      }
    });
  }

  onCheckAttributChange(event: any, element: IAttributs) {
    let listIdAttTemp: string[] = [];
    let positionsAttr = new Map();
    let indexAttrCourant: number = 0;
    this.donneeDocCatService.dataDocumentAttributs =
      this.ELEMENTS_TABLE_ATTRIBUTS;
    this.ELEMENTS_TABLE_ATTRIBUTS.forEach((ele: any) => {
      console.log('element :', ele.attributs.id);
      listIdAttTemp.push(ele.attributs.id);
      positionsAttr.set(ele.attributs.id, indexAttrCourant++);
    });

    if (event.target.checked) {
      console.log('listtemp :', listIdAttTemp, element.id);
      console.log(this.donneeDocCatService.dataDocumentAttributs);

      if (!listIdAttTemp.includes(element.id)) {
        this.ajoutSelectionAttribut(element);
        this.datas.push({ id: element.id, event: event });
        this.verif = false;
      } else {
        event.target.checked = false;
        return;
      }
    } else {
      this.verif = true;
      let i = 0;
      let res = false;

      while (res == false) {
        if (this.datas[i].id == element.id) {
          this.ELEMENTS_TABLE_ATTRIBUTS.splice(i, 1); // je supprime un seul element du tableau a la position 'i'
          this.dataSourceAttributResultat.data = this.ELEMENTS_TABLE_ATTRIBUTS;
          this.datas.splice(i, 1);
          res = true;
        }
        i++;
      }
    }
  }

  getAttributId(idAttribut: string) {
    this.idAttribut = idAttribut;
  }

  ajoutSelectionAttribut(attribut: IAttributs) {
    let listIdAttTemp: string[] = [];
    let positionsAttr = new Map();
    let indexAttrCourant: number = 0;
    this.donneeDocCatService.dataDocumentAttributs.forEach(
      (ele: IAttributs) => {
        listIdAttTemp.push(ele.id);
        positionsAttr.set(ele.id, indexAttrCourant++);
      }
    );
    this.ELEMENTS_TABLE_ATTRIBUTS = this.dataSourceAttributResultat.data;
    this.ELEMENTS_TABLE_ATTRIBUTS.push({
      attributs: attribut,
      valeur: '',
    });
    this.dataSourceAttributResultat.data = this.ELEMENTS_TABLE_ATTRIBUTS;
    this.donneeDocCatService.dataDocumentAttributs =
      this.ELEMENTS_TABLE_ATTRIBUTS;
    console.log(
      'attributs selectionnés :',
      this.donneeDocCatService.dataDocumentAttributs
    );
    return true;
  }

  viderselection() {
    this.datas.forEach((c) => (c.event.target.checked = false));
    this.datas = [];
    this.ELEMENTS_TABLE_ATTRIBUTS = [];
    this.dataSourceAttributResultat.data = this.ELEMENTS_TABLE_ATTRIBUTS;
    this.donneeDocCatService.dataDocumentAttributs =
      this.ELEMENTS_TABLE_ATTRIBUTS;
  }

  lastElementModal() {
    // this.donneeDocCatService.dataDocumentAttributs = this.STORE_ELEMENTS_ATTRIBUTS;
    // this.datas.forEach((c) => (c.event.target.checked = false));
    // this.datas = [];
    this.ELEMENTS_TABLE_ATTRIBUTS = [];
    this.donneeDocCatService.dataDocumentAttributs = []
    //this.donneeDocCatService.dataDocumentAttributs = this.STORE_ELEMENTS_ATTRIBUTS
    this.datas.forEach((c) => (c.event.target.checked = false));
    this.datas = [];
    console.log("ele store :", this.STORE_ELEMENTS_ATTRIBUTS, this.donneeDocCatService.dataDocumentAttributs);
    
  }

  verifierURL(url: string): boolean {
    // Expression régulière pour vérifier si la chaîne est une URL valide
    const regexURL: RegExp = /^(ftp|http|https):\/\/[^ "]+$/;
    return regexURL.test(url);
  }

  verifierEmail(mail: string): boolean {
    // Expression régulière pour vérifier si la chaîne est un email
    const regexEmail: RegExp =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regexEmail.test(mail);
  }

  isValidDate(dateString: string) {
    // Utiliser une expression régulière pour vérifier le format de la date (jj/mm/aaaa)
    var dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;

    // Vérifier si la chaîne de caractères correspond au format de date
    if (!dateRegex.test(dateString)) {
      return false;
    }

    // Vérifier si la date est réellement valide
    var dateParts = dateString.split('/');
    var day = parseInt(dateParts[0], 10);
    var month = parseInt(dateParts[1], 10) - 1; // Mois en JavaScript commence à partir de 0
    var year = parseInt(dateParts[2], 10);

    var date = new Date(year, month, day);

    return (
      date.getFullYear() === year &&
      date.getMonth() === month &&
      date.getDate() === day
    );
  }

  verificationModificationDansTableau(
    element: any,
    event: any,
    indexElement: number
  ) {
    console.log('element sélectionné :', element, event.target.value);
    this.ELEMENTS_TABLE_ATTRIBUTS = this.dataSourceAttributResultat.data;
    this.ELEMENTS_TABLE_ATTRIBUTS[indexElement].valeur = event.target.value;

    let faux: number = 0;
    for (let index = 0; index < this.ELEMENTS_TABLE_ATTRIBUTS.length; index++) {
      let element = this.ELEMENTS_TABLE_ATTRIBUTS[index];
      if (element.attributs.type == 'Number') {
        faux = 0;
        // Test si la valeur est un nombre
        if (!isNaN(parseFloat(element.valeur))) {
          console.log('La valeur saisie est un nombre.', element);
        } else {
          faux++;
          console.log("La valeur saisie n'est pas un nombre.", element);
        }
        console.log(' index', index);
      }

      //----------- cas du type date --------//
      if (element.attributs.type == 'Date') {
        if (this.isValidDate(element.valeur)) {
          // Si la conversion en date réussie, la validation réussie
          console.log('La valeur saisie est une date.', element.valeur);
        } else {
          faux++;
          console.log("La valeur saisie n'est pas une date.", element.valeur);
        }
      }

      //----------- cas de type radio et checkbox ------------//
      if (
        element.attributs.type == 'Checkbox' ||
        element.attributs.type == 'Radio'
      ) {
        if (element.valeur == null || element.valeur == '') {
          faux++;
        }
      }

      //----------- cas de type Email ---------------//
      if (element.attributs.type == 'Email') {
        if (this.verifierEmail(element.valeur)) {
          console.log('La valeur saisie est une address mail.', element.valeur);
        } else {
          faux++;
          console.log("La valeur saisie n'est pas un email.", element.valeur);
        }
      }

      //----------- cas de type URL ---------------//
      if (element.attributs.type == 'Url') {
        if (this.verifierURL(element.valeur)) {
          console.log('La valeur saisie est une Url valide.', element.valeur);
        } else {
          faux++;
          console.log("La valeur saisie n'est pas une url.", element.valeur);
        }
      }
      if (element.valeur == null || element.valeur == '') {
        faux++;
      }
    }
    if (faux <= 0) {
      this.valid = false;
    } else {
      this.valid = true;
    }

    console.log('valeurs :', this.ELEMENTS_TABLE_ATTRIBUTS);

    return this.valid;
  }

  get f() {
    return this.formeAttribut.controls;
  }

  onSubmit(personnelInput: any) {
    this.submitted = true;
    //Todo la validation d'element non conforme passe
    if (this.formeAttribut.invalid) return;

    this.valid = false;

    /* let personnelTemp : IPersonnel={
      id: uuidv4(),
      nom:personnelInput.nom,
      prenom:personnelInput.prenom,
      sexe:personnelInput.sexe,
      email:personnelInput.email,
      telephone:personnelInput.telephone,
      dateNaissance:personnelInput.dateNaissance,
      dateEntree: personnelInput.dateEntree,
      dateSortie: personnelInput.dateSortie
    }

    if(this.personnel != undefined){
      personnelTemp.id = this.personnel.id
    }
    this.personnelService.ajouterPersonnel(personnelTemp).subscribe(
      object => {
        this.router.navigate(['/list-personnels']);
      }
    ) */
    this.datas.forEach((c) => (c.event.target.checked = false));
  }

  retirerSelectionAttribut(index: number) {
    this.ELEMENTS_TABLE_ATTRIBUTS = this.dataSourceAttributResultat.data;

    if (this.ELEMENTS_TABLE_ATTRIBUTS[index].attributs.id) {
      if (this.datas.length > 0) {
        let i = 0;
        let res = false;
        while (res == false) {
          if (
            this.datas[i].id ==
            this.ELEMENTS_TABLE_ATTRIBUTS[index].attributs.id
          ) {
            this.datas[i].event.target.checked = false;
            this.datas.splice(i, 1);
            res = true;
          }
          i++;
        }
      }
      this.ELEMENTS_TABLE_ATTRIBUTS.splice(index, 1); // je supprime un seul element du tableau a la position 'index'
    }
    this.dataSourceAttributResultat.data = this.ELEMENTS_TABLE_ATTRIBUTS;
    this.donneeDocCatService.dataDocumentAttributs =
      this.ELEMENTS_TABLE_ATTRIBUTS;
  }
  private getAllAttributs() {
    return this.serviceAttribut.getAllAttributs();
  }
  displayFn(attribue: IAttributs): string {
    return attribue && attribue.titre ? attribue.titre : '';
  }

  ngAfterViewInit() {
    this.dataSourceAttribut.paginator = this.paginator;
    this.dataSourceAttribut.sort = this.sort;
  }

  public rechercherListingAttribut(option: IAttributs) {
    this.serviceAttribut
      .getAttributsByTitre(option.titre.toLowerCase())
      .subscribe((valeurs) => {
        this.dataSourceAttribut.data = valeurs;
      });
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}
