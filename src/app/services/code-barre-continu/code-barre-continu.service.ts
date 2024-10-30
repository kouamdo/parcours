import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CodeBarreContinuService {
  private scanResultSubject = new BehaviorSubject<string>('');
  scanResult$ = this.scanResultSubject.asObservable();

  constructor() { }

  setScanResult(result: string) {
    this.scanResultSubject.next(result);
  }

}
