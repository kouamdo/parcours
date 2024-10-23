import { LiveAnnouncer } from '@angular/cdk/a11y';
import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { IComptes } from 'src/app/modele/comptes';
import { IPatient } from 'src/app/modele/Patient';
import { ComptesService } from 'src/app/services/comptes/comptes.service';
import { PatientsService } from 'src/app/services/patients/patients.service';

@Component({
  selector: 'app-modal-affecter-compte-personnel',
  templateUrl: './modal-affecter-compte-personnel.component.html',
  styleUrls: ['./modal-affecter-compte-personnel.component.scss']
})
export class ModalAffecterComptePersonnelComponent {
  forme: FormGroup;
  btnLibelle: string = 'Ajouter';
  //titre: string="Ajouter attribut";
  submitted: boolean = false;
  titre: string = '';
  personnels: IPatient[] = []
  compte: IComptes | undefined;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialogRef: DialogRef,
    private formBuilder: FormBuilder,
    private compteService: ComptesService,
    private _liveAnnouncer: LiveAnnouncer,
    private userService: PatientsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.forme = this.formBuilder.group({
      personnel: new FormControl<string | IPatient>('')
    });
  }

  ngOnInit(): void {
    this.compte = this.data.compte;
    this.userService.getAllPatients().subscribe(
      (reponse) =>{
        this.personnels=reponse
      }
    );

    this.compteService.getCompteById(this.compte!.id).subscribe((res) => {
      if (res) {
        this.forme.setValue({
          personnel: res.beneficiaire
        })
      }
    })
  }

  get f() {
    return this.forme.controls;
  }

  displayFn(personne: IPatient): string {
    return personne && personne.nom ? personne.nom : '';
  }

  onSubmit(selectItem: any) {
    this.submitted = true;

    if(this.forme.invalid) return;

    this.compteService.getCompteById(this.compte!.id).subscribe((res) => {

        let compte: IComptes = {
          id: res.id,
          libelle: res.libelle,
          solde: res.solde,
          dateCreation: res.dateCreation,
          montantDecouvertMax: res.montantDecouvertMax,
          beneficiaire: selectItem.personnel
        }
        
        this.compteService.ajouterCompte(compte).subscribe((obj) => {}); 
    })
    this.dialogRef.close();
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}
