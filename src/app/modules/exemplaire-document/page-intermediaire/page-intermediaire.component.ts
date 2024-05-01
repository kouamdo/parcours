import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DonneesEchangeService } from 'src/app/services/donnees-echange/donnees-echange.service';
import { ModalChoixPersonneComponent } from '../../shared/modal-choix-personne/modal-choix-personne.component';

@Component({
  selector: 'app-page-intermediaire',
  templateUrl: './page-intermediaire.component.html',
  styleUrls: ['./page-intermediaire.component.scss']
})
export class PageIntermediaireComponent  implements OnInit {
  
  constructor(private donneeExemplairePersonneRatacheeService:DonneesEchangeService,private dialogDef : MatDialog ) { }
  
  
  ngOnInit(): void {
    this.openChoixPersonneDialog()
  }

  /**
   * Methode permettant d'ouvrir la modal de choix de la personne dont
   * on veux afficher les documents
   */
  openChoixPersonneDialog(){

    const dialogRef = this.dialogDef.open(ModalChoixPersonneComponent,
    {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      enterAnimationDuration:'1000ms',
      exitAnimationDuration:'1000ms',
      panelClass: 'modalExemplairecDePersonne', // Add your custom panel class
      data:{}
    }
    )

    dialogRef.afterClosed().subscribe(result => {
      
    });
  }
}
