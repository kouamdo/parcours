import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { IPromo } from 'src/app/modele/promo-distributeur';
import { IRessource } from 'src/app/modele/ressource';
import { DonneesEchangeService } from 'src/app/services/donnees-echange/donnees-echange.service';
import { PromoService } from 'src/app/services/promo/promo.service';

@Component({
  selector: 'app-modal-choix-promotion-ressource',
  templateUrl: './modal-choix-promotion-ressource.component.html',
  styleUrls: ['./modal-choix-promotion-ressource.component.scss']
})
export class ModalChoixPromotionRessourceComponent  implements OnInit{

  filteredOptions: IPromo[] | undefined;
  promotionCourente : IPromo | undefined
  ressourceCourante: IRessource | undefined
  ELEMENTS_TABLE_PROMO: IPromo[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['emetteur', 'dateDebut', 'dateFin', 'codeUnique', 'montantRemise', 'pourcentageRemise', 'famille', 'ressource', 'actions'];
  dataSource = new MatTableDataSource<IPromo>(this.ELEMENTS_TABLE_PROMO);
  formePromoRessource: FormGroup;
  
  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private router:Router,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private servicePromotion:PromoService,
    private donneeEchangeService:DonneesEchangeService,
    private dialogRef: MatDialogRef<ModalChoixPromotionRessourceComponent>
  ) {
    
    this.formePromoRessource = this.formBuilder.group({
      promoControl: new FormControl<string | IPromo>('')
    });
  }
  
  ngOnInit(): void {

    this.ressourceCourante = this.donneeEchangeService.dataRessourceMouvementCourant

    this.getPromosByRessource(this.ressourceCourante!).subscribe(valeurs => {
      this.dataSource.data = valeurs
    // Initialiser le formulaire avec la promotion courante (si nécessaire)
    this.formePromoRessource.setValue({
      promoControl: this.donneeEchangeService.dataPromoMouvementCourant
    });
    });

    this.promotionCourente = this.donneeEchangeService.dataPromoMouvementCourant

  }

  displayFn(promo: IPromo): string {
    return promo && promo.emetteur.raisonSocial ? promo.emetteur.raisonSocial: '';
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  isLastElement(array: any[], element: any): boolean {
    return array.indexOf(element) === array.length - 1;
  }

  get f() {
    return this.formePromoRessource.controls;
  }

  private getPromosByRessource(ressource:IRessource){
    return this.servicePromotion.getPromosByRessource(ressource);
  }

  public getPromotion(option: IPromo, event: any){
    if (event.target.checked) {
      this.promotionCourente = option
    }
  }
  reinitialier() {
    this.formePromoRessource.reset()
    this.promotionCourente = undefined
  }
  // Annuler et fermer la boîte de dialogue
  onCancel() {
    this.dialogRef.close();
  }
  // Sauvegarder les changements et fermer la boîte de dialogue
  onSave() {
    this.donneeEchangeService.dataPromoMouvementCourant = this.promotionCourente
  }
}
