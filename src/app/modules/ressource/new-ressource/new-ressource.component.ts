
import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TypeUnite } from 'src/app/modele/type-unite';

import { IRessource } from 'src/app/modele/ressource';
import { RessourcesService } from 'src/app/services/ressources/ressources.service';
import {v4 as uuidv4} from 'uuid';
import { MatTableDataSource } from '@angular/material/table';

import { EMPTY, Observable } from 'rxjs';
import { IFamille } from 'src/app/modele/famille';
import { FamillesService } from 'src/app/services/familles/familles.service';

@Component({
  selector: 'app-new-ressource',
  templateUrl: './new-ressource.component.html',
  styleUrls: ['./new-ressource.component.scss']
})
export class NewRessourceComponent implements OnInit {

  ressource : IRessource|undefined;
  forme: FormGroup;
  btnLibelle: string="Ajouter";
  submitted: boolean=false;


  //initialDateCreation = new FormControl(new Date());
  //initialDateModification = new FormControl(new Date());
  ressources$:Observable<IFamille>=EMPTY;
  myControl = new FormControl<string | IFamille>('');
  filteredOptions: IFamille[] | undefined;
  dataSource = new MatTableDataSource<IFamille>();
  familleDeRessource: IFamille = {
    id: '',
    libelle: '',
    description: '',
    etat: ''
  };


  constructor(private formBuilder:FormBuilder,private familleService:FamillesService,private ressourceService:RessourcesService,private serviceRessource:RessourcesService,private serviceFamille:FamillesService,private router:Router, private infosPath:ActivatedRoute, private datePipe: DatePipe) {
    this.forme = this.formBuilder.group({
      libelle: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      etat: [ '', [Validators.required,]],
      quantite: ['', [Validators.required]],
      unite: ['', [Validators.required]],
      prix: ['', [Validators.required]],
      famille: [''],
     // dateCreation: ['', [Validators.required]],
      //dateModification: ['',[Validators.required]],
    })
  };


  ngOnInit(): void {
    this.getAllFamilles().subscribe(valeurs => {
      this.dataSource.data = valeurs;
    });
    this.myControl.valueChanges.subscribe(
      value => {
        const libelle = typeof value === 'string' ? value : value?.libelle;
        if(libelle != undefined && libelle?.length >0){
          this.serviceFamille.getFamillesByLibelle(libelle.toLowerCase() as string).subscribe(
            reponse => {
              this.filteredOptions = reponse;
            }
          )
        }
        else{
          this.filteredOptions = [];
        }

      }
    );

    let idRessource = this.infosPath.snapshot.paramMap.get('idRessource');
    if((idRessource != null) && idRessource!==''){
      this.btnLibelle="Modifier";
      this.ressourceService.getRessourceById(idRessource).subscribe(x =>
        {
          this.ressource = x; console.log(this.ressource);
          this.ressource.id = idRessource!,
          this.forme.setValue({
            libelle: this.ressource?.libelle,
            etat: this.ressource.etat,
           // dateCreation: this.datePipe.transform(this.ressource.dateCreation,'yyyy-MM-dd'),
           // dateModification: this.datePipe.transform(this.ressource.dateModification,'yyyy-MM-dd'),
            quantite: this.ressource?.quantite,
            unite: this.ressource.unite,
            prix: this.ressource?.prix,
            famille: this.ressource.famille
          })
      });
    }

  }

  get f(){
    return this.forme.controls;
  }

  getIdFamille(id_famille : string){

    this.serviceFamille.getFamilleById(id_famille).subscribe(
      famille =>{
        this.familleDeRessource = famille
      }
    )
  }

  onSubmit(ressourceInput:any){

    this.submitted=true;
    if(this.forme.invalid) return;

    let ressourceTemp : IRessource={
      id: uuidv4(),
      libelle: ressourceInput.libelle,
      etat: ressourceInput.etat,
     // dateCreation: ressourceInput.dateCreation,
      //dateModification: ressourceInput.dateModification,
      quantite: ressourceInput.quantite,
      unite: ressourceInput.unite,
      prix: ressourceInput.prix,
      famille:ressourceInput.famille
    }

   // ressourceTemp.dateCreation = this.initialDateCreation.value!
    //ressourceTemp.dateModification = this.initialDateModification.value!

    if(this.ressource != undefined){
      ressourceTemp.id = this.ressource.id
    }

    ressourceTemp.famille = this.familleDeRessource

    console.log('voici la famille de cette ressource : ', ressourceTemp.famille)

    this.ressourceService.ajouterRessource(ressourceTemp).subscribe(
      object => {
        this.router.navigate(['list-ressources']);
      },
      error =>{
        console.log(error)
      }
    )
  }


  private getAllFamilles(){
    return this.serviceFamille.getAllFamilles();
  }
// ici il faut remplacer attribut par famille, ce sera plus comprehensible
  displayFn(attribue: IFamille): string {
    return attribue && attribue.libelle ? attribue.libelle : '';
  }

  public rechercherListingFamille(option: IFamille){
    this.serviceFamille.getFamillesByLibelle(option.libelle.toLowerCase()).subscribe(
        valeurs => {this.dataSource.data = valeurs;}
    )
  }








}
