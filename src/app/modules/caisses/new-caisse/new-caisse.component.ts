import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ICaisses } from 'src/app/modele/caisses';
import { CaissesService } from 'src/app/services/caisses/caisses.service';
import { DonneesEchangeService } from 'src/app/services/donnees-echange/donnees-echange.service';

@Component({
  selector: 'app-new-caisse',
  templateUrl: './new-caisse.component.html',
  styleUrls: ['./new-caisse.component.scss']
})
export class NewCaisseComponent implements OnInit {
  caisse: ICaisses | undefined;
  forme: FormGroup;
  titre: string = '';
  btnLibelle: string = 'Ajouter';
  //titre: string="Ajouter Caisse";
  submitted: boolean = false;

  constructor (
    private formBuilder: FormBuilder,
    private dataEnteteMenuService: DonneesEchangeService,
    private caisseService: CaissesService,
    private router: Router,
    private infosPath: ActivatedRoute,
    private datePipe: DatePipe
  ) {
    this.forme = this.formBuilder.group({
      libelle: [
        '',
        [
          Validators.required
        ],
      ],
      type: [
        '',
        [
          Validators.required
        ],
      ],
      solde: [''],
      detailsJson: ['']
    });
  }

  ngOnInit(): void {
    let idCaisse = this.infosPath.snapshot.paramMap.get('idCaisse');
    if (idCaisse != null && idCaisse !== '') {
      this.btnLibelle = 'Modifier';
      this.titre = 'Caisse à Modifier';
      this.caisseService.getCaisseById(idCaisse).subscribe((x) => {
        this.caisse = x;
        this.forme.setValue({
          libelle: this.caisse.libelle,
          solde: this.caisse.solde,
          type: this.caisse.type,
          detailsJson: this.caisse.detailsJson! || '',
        });
      });
    }
    this.titre = this.dataEnteteMenuService.dataEnteteMenu;
  }

  get f() {
    return this.forme.controls;
  }

  return(){
    this.router.navigate(['/list-caisses']);
  }

  onSubmit(caisseInput: ICaisses) {
    this.submitted = true;
    if (this.forme.invalid) return;

      let caisseTemp: ICaisses = {
        id: uuidv4(),
        libelle: caisseInput.libelle,
        solde: caisseInput.solde,
        type: caisseInput.type,
        detailsJson: caisseInput.detailsJson,
      };

      if (this.caisse != undefined) {
        caisseTemp.id = this.caisse.id;
      }

      console.log('valeur final :', caisseTemp);

      this.caisseService.ajouterCaisse(caisseTemp).subscribe((object) => {
        this.router.navigate(['/list-caisses']);
      });
  }
}

