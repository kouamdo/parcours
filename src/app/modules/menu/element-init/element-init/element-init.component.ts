import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { IElementInit } from 'src/app/modele/element-init';
import { ElementInitService } from 'src/app/services/element-init/element-init.service';

@Component({
  selector: 'app-element-init',
  templateUrl: './element-init.component.html',
  styleUrls: ['./element-init.component.css']
})
export class ElementInitComponent implements OnInit {

  iElementInit : IElementInit = {};
  libelle = this.iElementInit.libelle;

  constructor(private router:Router, private elementInitService:ElementInitService, private translate:TranslateService) { 
  
  }

  ngOnInit(): void {
    /*alert(this.iElementInit.libelle);*/
  }

}
