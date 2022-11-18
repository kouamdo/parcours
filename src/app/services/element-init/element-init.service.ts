import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { IElementInit } from 'src/app/modele/element-init';

@Injectable({
  providedIn: 'root'
})
export class ElementInitService {
  iElementInit : IElementInit = {};
  constructor() {
    this.iElementInit.libelle = "Patient";
  }
}
