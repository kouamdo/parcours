import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { IElements } from 'src/app/modele/elements';

@Injectable({
  providedIn: 'root'
})
export class PassActionService {

  constructor() { }

  private langueDataSubject = new BehaviorSubject<string>('fr' || localStorage.getItem('langue'));
  langueData$: Observable<string> = this.langueDataSubject.asObservable();

  updateLangueData(langue: string) {
    this.langueDataSubject.next(langue);
  }

  setActions(actions: IElements[]) {
    localStorage.setItem('actions', JSON.stringify(actions));
  }

  getActions(): Observable<IElements[]> {
    const data = localStorage.getItem('actions');
    let parentDataSubject = new BehaviorSubject<IElements[]>(JSON.parse(data!));
    let parentData$ = parentDataSubject.asObservable();
    return parentData$;
  }
}
