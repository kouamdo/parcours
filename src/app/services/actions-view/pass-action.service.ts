import { Injectable } from '@angular/core';
import { IElements } from 'src/app/modele/elements';

@Injectable({
  providedIn: 'root'
})
export class PassActionService {

  constructor() { }

  setActions(actions: IElements[]) {
    localStorage.setItem('actions', JSON.stringify(actions))
  }

  getActions(): IElements[] {
    return JSON.parse(localStorage.getItem('actions')!);
  }
}
