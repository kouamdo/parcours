import { LiveAnnouncer } from '@angular/cdk/a11y';
import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, Sort } from '@angular/material/sort';
import { IGroupes } from 'src/app/modele/groupes';
import { IPersonnel } from 'src/app/modele/personnel';
import { IUtilisateurs } from 'src/app/modele/utilisateurs';
import { GroupesService } from 'src/app/services/groupes/groupes.service';
import { UtilisateurService } from 'src/app/services/utilisateurs/utilisateur.service';

@Component({
  selector: 'app-modal-choix-groups',
  templateUrl: './modal-choix-groups.component.html',
  styleUrls: ['./modal-choix-groups.component.scss']
})
export class ModalChoixGroupsComponent implements OnInit {
  forme: FormGroup;
  btnLibelle: string = 'Ajouter';
  //titre: string="Ajouter attribut";
  submitted: boolean = false;
  titre: string = '';
  groupes: IGroupes[] = []
  person: IPersonnel | undefined;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialogRef: DialogRef,
    private _snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private groupeService: GroupesService,
    private _liveAnnouncer: LiveAnnouncer,
    private userService: UtilisateurService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.forme = this.formBuilder.group({
      groupe: new FormControl<string | IGroupes>('')
    });
  }

  ngOnInit(): void {
    this.person = this.data.personnel;
    this.groupeService.getAllGroups().subscribe(
      (reponse) =>{
        this.groupes=reponse
      }
    );

    this.userService.getUtilisateurByMail(this.person!.email).subscribe((res) => {
      if (res) {
        this.forme.setValue({
          groupe: res.groupe
        })
      }
    })
  }

  get f() {
    return this.forme.controls;
  }

  displayFn(groupe: IGroupes): string {
    return groupe && groupe.libelle ? groupe.libelle : '';
  }

  onSubmit(selectItem: any) {
    this.submitted = true;

    if(this.forme.invalid) return;

    this.userService.getUtilisateurByMail(this.person!.email).subscribe((res) => {

      if (res) {
        let user: IUtilisateurs = {
          id: res.id,
          login: res.login,
          user: this.person!,
          passWord: res.passWord,
          groupe: selectItem.groupe
        }
        
        this.userService.updateUser(user).subscribe((obj) => {}); 
      } else {
        this._snackBar.open('L\'utilisateur n\'existe pas', 'fermer', {
          duration: 3000
        });
      }
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
