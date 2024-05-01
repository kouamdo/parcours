import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IExemplaireDocument } from 'src/app/modele/exemplaire-document';
import { IMouvement } from 'src/app/modele/mouvement';
import { TypeMouvement } from 'src/app/modele/typeMouvement';
import { DocumentService } from 'src/app/services/documents/document.service';
import { DonneesEchangeService } from 'src/app/services/donnees-echange/donnees-echange.service';
import { ExemplaireDocumentService } from 'src/app/services/exemplaire-document/exemplaire-document.service';

@Component({
  selector: 'app-view-exemplaire',
  templateUrl: './view-exemplaire.component.html',
  styleUrls: ['./view-exemplaire.component.scss']
})
export class ViewExemplaireComponent implements OnInit {

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
    DocEtats: [],
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
  constructor(private router:Router, private infosPath:ActivatedRoute,private dataEnteteMenuService:DonneesEchangeService, private serviceDocument:DocumentService, private serviceExemplaire:ExemplaireDocumentService) {}

  ngOnInit(): void {
    let idExemplaire = this.infosPath.snapshot.paramMap.get('idExemplaire');
    if((idExemplaire != null) && idExemplaire!==''){
      this.serviceExemplaire.getExemplaireDocumentById(idExemplaire).subscribe(
        x =>{
          this.exemplaire = x;
          if (this.exemplaire.mouvements != undefined) {
            this.mouvements = this.exemplaire.mouvements
          }
        });
    }
    this.titre=this.dataEnteteMenuService.dataEnteteMenu
  }
}
