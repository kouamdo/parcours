import { Component, OnInit } from '@angular/core';
import { DonneesEchangeService } from 'src/app/services/donnees-echange/donnees-echange.service';

@Component({
  selector: 'app-entete',
  templateUrl: './entete.component.html',
  styleUrls: ['./entete.component.scss']
})
export class EnteteComponent implements OnInit {
titre:string='';
  constructor(private dataEnteteMenuService:DonneesEchangeService) { }

  ngOnInit(): void {
   this.titre=this.dataEnteteMenuService.dataEnteteMenu
  }

}
