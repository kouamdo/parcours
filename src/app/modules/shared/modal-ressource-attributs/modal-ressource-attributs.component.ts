import { LiveAnnouncer } from '@angular/cdk/a11y';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { IAttributs } from 'src/app/modele/attributs';
import { AttributService } from 'src/app/services/attributs/attribut.service';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { DonneesEchangeService } from 'src/app/services/donnees-echange/donnees-echange.service';
import { IRessource } from 'src/app/modele/ressource';
import { IType } from 'src/app/modele/type';

@Component({
  selector: 'app-modal-ressource-attributs',
  templateUrl: './modal-ressource-attributs.component.html',
  styleUrls: ['./modal-ressource-attributs.component.scss'],
})
export class ModalRessourceAttributsComponent implements OnInit {
  // variables attributs, pour afficher le tableau d'attributs sur l'IHM
  selectedAttributeIds: string[] = [];
  formeAttribut: FormGroup;
  valid: boolean = false;
  textError : string = "";
  stockDonnee: any;
  initialDataDocumentAttributs: any[] = [];
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
  dataSourceAttribut = new MatTableDataSource<IAttributs>();
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
    private dialogRef: MatDialogRef<ModalRessourceAttributsComponent>,
    private donneeDocCatService: DonneesEchangeService,
    public dialog: MatDialog
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
    this.loadSelectedAttributes();

    if (this.donneeDocCatService.dataDocumentRessourcesAttributs.length > 0) {
      this.ELEMENTS_TABLE_ATTRIBUTS = JSON.parse(
        JSON.stringify(this.donneeDocCatService.dataDocumentRessourcesAttributs)
      );
      this.dataSourceAttributResultat.data = this.ELEMENTS_TABLE_ATTRIBUTS;
      console.log(
        'resultats tb :', this.donneeDocCatService.dataDocumentRessourcesAttributs
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

  loadSelectedAttributes() {
    this.selectedAttributeIds =
      this.donneeDocCatService.dataDocumentRessourcesAttributs.map(
        (attr: { attributs: IAttributs; valeur: string }) => attr.attributs.id
      );
  }

  onCheckAttributChange(event: any, element: IAttributs) {
    let listIdAttTemp: string[] = [];
    this.ELEMENTS_TABLE_ATTRIBUTS.forEach((ele: any) => {
      console.log('element :', ele.attributs.id);
      listIdAttTemp.push(ele.attributs.id);
    });

    if (event.target.checked) {
      console.log('listtemp :', listIdAttTemp, element.id);

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

  saveModal(){
    let count = 0;
    this.dataSourceAttributResultat.data.forEach((attribut) => {
      if (attribut.valeur == null || attribut.valeur == "") {
        count++;
      }
    });
    if (count > 0) {
      this.valid = true;
      this.textError = "La colonne valeur de chaque ligne est obligatoire";
    } else {
      this.valid = false;
      this.donneeDocCatService.dataDocumentRessourcesAttributs = this.ELEMENTS_TABLE_ATTRIBUTS;
      console.log("element final :", this.donneeDocCatService.dataDocumentRessourcesAttributs, this.valid);
      this.dialogRef.close();
    }
  }

  ajoutSelectionAttribut(attribut: IAttributs) {
    this.ELEMENTS_TABLE_ATTRIBUTS = this.dataSourceAttributResultat.data;
    this.ELEMENTS_TABLE_ATTRIBUTS.push({
      attributs: attribut,
      valeur: '',
    });
    this.dataSourceAttributResultat.data = this.ELEMENTS_TABLE_ATTRIBUTS;
    return true;
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

  verificationModificationDansTableau(element: any, event: any, indexElement: number) 
  {
    console.log('element select : ', element);

      if (element.attributs.type == 'Text') {
        if (event.target.value) {
          this.valid = false;
        } else {
          this.valid = true;
        }   
      }
    
      if (element.attributs.type == 'Number') {
        // Test si la valeur est un nombre
        if (!isNaN(parseFloat(event.target.value))) {
          this.valid = false;
          console.log('La valeur saisie est un nombre.', event.target.value);
        } else {
          this.valid = true;
          this.textError = "La valeur saisie n'est pas un nombre.";
        }
      }

      //----------- cas du type date --------//
      if (element.attributs.type == 'Date') {
        if (this.isValidDate(event.target.value)) {
          // Si la conversion en date réussie, la validation réussie
          this.valid = false;
          console.log('La valeur saisie est une date.', event.target.value);
        } else {
          this.valid = true;
          this.textError = "La valeur saisie n'est pas une date.";
        }
      }

      //----------- cas de type radio et checkbox ------------//
      if (
        element.attributs.type == 'Checkbox' ||
        element.attributs.type == 'Radio'
      ) {
        if (event.target.value == null || event.target.value == '') {
          this.valid = true;
        } else {
          this.valid = false;
        }
      }

      //----------- cas de type Email ---------------//
      if (element.attributs.type == 'Email') {
        if (this.verifierEmail(event.target.value)) {
          this.valid = false;
          console.log('La valeur saisie est une address mail.', event.target.value);
        } else {
          this.valid = true;
          this.textError = "La valeur saisie n'est pas un email.";
        }
      }

      //----------- cas de type URL ---------------//
      if (element.attributs.type == 'Url') {
        if (this.verifierURL(event.target.value)) {
          this.valid = false;
          console.log('La valeur saisie est une Url valide.', event.target.value);
        } else {
          this.valid = true;
          this.textError = "La valeur saisie n'est pas une url.";
        }
      }

      if (this.valid == false) {
        this.ELEMENTS_TABLE_ATTRIBUTS[indexElement].valeur = event.target.value;
      }

    return this.valid;
  }

  get f() {
    return this.formeAttribut.controls;
  }

  onSubmit(personnelInput: any) {
    //Todo la validation d'element non conforme passe
    if (this.valid) return;

    this.valid = false;
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
