import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IAttributs } from 'src/app/modele/attributs';
import { AttributService } from 'src/app/services/attributs/attribut.service';
import { DonneesEchangeService } from 'src/app/services/donnees-echange/donnees-echange.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-new-attribut',
  templateUrl: './new-attribut.component.html',
  styleUrls: ['./new-attribut.component.scss'],
})
export class NewAttributComponent implements OnInit {
  attribut: IAttributs | undefined;
  forme: FormGroup;
  btnLibelle: string = 'Ajouter';
  //titre: string="Ajouter attribut";
  submitted: boolean = false;
  titre: string = '';
  typeAttribut: String[] = [];
  // La propriété pour stocker la valeur de l'input
  inputValeur: string = '';
  errorNb: boolean = false;
  textError: string = '';
  dateResultat: Date | null = null;

  /*initialDateCreation = new FormControl(new Date());
  initialDateModification = new FormControl(new Date());*/
  constructor(
    private formBuilder: FormBuilder,
    private dataEnteteMenuService: DonneesEchangeService,
    private attributService: AttributService,
    private router: Router,
    private infosPath: ActivatedRoute,
    private datePipe: DatePipe
  ) {
    this.forme = this.formBuilder.group({
      titre: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      etat: [true],
      type: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      valeursParDefaut: [''],
    });
  }

  ngOnInit(): void {
    this.attributService.getTypeAttribut().subscribe((t) => {
      this.typeAttribut = t.type;
    });
    let idAttribut = this.infosPath.snapshot.paramMap.get('idAttribut');
    if (idAttribut != null && idAttribut !== '') {
      this.btnLibelle = 'Modifier';
      this.titre = 'service à Modifier';
      this.attributService.getAttributById(idAttribut).subscribe((x) => {
        this.attribut = x;
        this.forme.setValue({
          titre: this.attribut.titre,
          description: this.attribut.description,
          etat: this.attribut.etat,
          type: this.attribut.type,
          valeursParDefaut: this.attribut?.valeursParDefaut,
        });
        this.inputValeur = this.attribut?.valeursParDefaut;
      });
    }
    this.titre = this.dataEnteteMenuService.dataEnteteMenu;
  }

  get f() {
    return this.forme.controls;
  }

  verifierCaracteresNumeriques(chaine: string): boolean {
    return /[^0-9.]/.test(chaine); // Utilisation d'une expression régulière pour vérifier si la chaîne contient uniquement des chiffres
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

  verifierURL(url: string): boolean {
    // Expression régulière pour vérifier si la chaîne est une URL valide
    const regexURL: RegExp = /^(ftp|http|https):\/\/[^ "]+$/;
    return regexURL.test(url);
  }

  // Méthode pour gérer les changements dans l'input
  onInputChange() {
    this.errorNb = false;

    //----------- cas de type radio et checkbox ------------//
    if (
      this.forme.get('type')?.value == 'Checkbox' ||
      this.forme.get('type')?.value == 'Radio'
    ) {
      // Vérifier le type et séparer les valeurs
      //const valeursSeparees: string[] = this.inputValeur.split(';');
      // Remplacez les espaces par des points-virgules
      this.inputValeur = this.inputValeur.replace(/\s+/g, ';');
      this.inputValeur = this.inputValeur.replace(/;+/g, ';');
      this.inputValeur = this.inputValeur.replace(/,/g, '');

      // Faire quelque chose avec les valeurs séparées
      console.log('valeur saisie :', this.inputValeur);

      // Divisez la chaîne saisie en valeurs individuelles
      const valeurs: string[] = this.inputValeur
        .split(';')
        .map((value) => value.trim());
      console.log('valeur separe :', valeurs);
      if (this.forme.get('type')?.value == 'Radio') {
        if (valeurs.length < 2 || valeurs[1] == '') {
          this.errorNb = true;
          this.textError =
            'Au moins deux valeurs doivent être saisies pour ce type';
        } else {
          this.errorNb = false;
        }
      }

      if (this.forme.get('type')?.value == 'Checkbox') {
        if (valeurs.length < 1 || valeurs[0] == '') {
          this.errorNb = true;
          this.textError = 'Au moins une valeur doit être saisie pour ce type';
        } else {
          this.errorNb = false;
        }
      }
    }

    //----------- cas du type date --------//
    if (this.forme.get('type')?.value == 'Date') {
      this.inputValeur = this.inputValeur.replace(/-/g, '/');
      if (this.inputValeur.includes(';')) {
        this.errorNb = true;
        this.inputValeur = this.inputValeur.replace(/;/g, '');
        this.inputValeur = this.inputValeur.replace(/\s+/g, '');
        this.textError = 'Pas de multiples valeurs';
      }

      if (this.isValidDate(this.inputValeur)) {
        // Si la conversion en date réussie, la validation réussie
        console.log(
          'La valeur saisie est une date.',
          this.inputValeur,
          this.dateResultat
        );
        this.errorNb = false;
      } else {
        this.errorNb = true;
        this.textError = 'votre saisie ne respecte pas le format de ce type';
        console.log(
          "La valeur saisie n'est pas une date.",
          this.inputValeur,
          this.isValidDate(this.inputValeur)
        );
      }
    }

    //----------- cas de type Number ---------------//
    if (this.forme.get('type')?.value == 'Number') {
      if (this.inputValeur.includes(';')) {
        this.errorNb = true;
        this.inputValeur = this.inputValeur.replace(/;/g, '');
        this.inputValeur = this.inputValeur.replace(/\s+/g, '');
        this.textError = 'Pas de multiples valeurs';
      }
      if (!this.verifierCaracteresNumeriques(this.inputValeur)) {
        if (parseFloat(this.inputValeur)) {
          // Test si la valeur est un nombre
          console.log('La valeur saisie est un nombre.', this.inputValeur);
        } else {
          this.errorNb = true;
          this.textError = 'votre saisie ne respecte pas le format de ce type';
          console.log(
            "La valeur saisie n'est pas un nombre.",
            this.inputValeur
          );
        }
      } else {
        this.errorNb = true;
        this.textError = 'votre saisie ne respecte pas le format de ce type';
        console.log("La valeur saisie n'est pas un nombre.", this.inputValeur);
      }
    }

    //----------- cas de type Email ---------------//
    if (this.forme.get('type')?.value == 'Email') {
      if (this.inputValeur.includes(';')) {
        this.errorNb = true;
        this.inputValeur = this.inputValeur.replace(/;/g, '');
        this.inputValeur = this.inputValeur.replace(/\s+/g, '');
        this.textError = 'Pas de multiples valeurs';
      }
      if (this.verifierEmail(this.inputValeur)) {
        console.log('La valeur saisie est une address mail.', this.inputValeur);
      } else {
        this.errorNb = true;
        this.textError = 'votre saisie ne respecte pas le format de ce type';
        console.log("La valeur saisie n'est pas un email.", this.inputValeur);
      }
    }

    //----------- cas de type URL ---------------//
    if (this.forme.get('type')?.value == 'Url') {
      if (this.inputValeur.includes(';')) {
        this.errorNb = true;
        this.inputValeur = this.inputValeur.replace(/;/g, '');
        this.inputValeur = this.inputValeur.replace(/\s+/g, '');
        this.textError = 'Pas de multiples valeurs';
      }
      if (this.verifierURL(this.inputValeur)) {
        console.log('La valeur saisie est une Url valide.', this.inputValeur);
      } else {
        this.errorNb = true;
        this.textError = 'votre saisie ne respecte pas le format de ce type';
        console.log("La valeur saisie n'est pas une url.", this.inputValeur);
      }
    }
  }

  onSubmit(attributInput: any) {
    this.submitted = true;
    if (this.forme.invalid) return;

    if (this.errorNb == true) {
    } else {
      let attributTemp: IAttributs = {
        id: uuidv4(),
        titre: attributInput.titre,
        description: attributInput.description,
        etat: attributInput.etat,
        type: attributInput.type,
        valeursParDefaut: attributInput.valeursParDefaut,
      };

      if (this.attribut != undefined) {
        attributTemp.id = this.attribut.id;
      }

      console.log('valeur final :', attributTemp);

      this.attributService.ajouterAttribut(attributTemp).subscribe((object) => {
        this.router.navigate(['/list-attributs']);
      });
    }
  }
}
