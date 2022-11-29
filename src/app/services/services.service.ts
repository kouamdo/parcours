import { Injectable } from '@angular/core';
import { IService } from '../modele/service';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  ajouterService(serviceTemp: IService) {
    throw new Error('Method not implemented.');
  }
  getServiceById(arg0: number) {
    throw new Error('Method not implemented.');
  }

  constructor() { }
}
