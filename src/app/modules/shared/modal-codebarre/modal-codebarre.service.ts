import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalCodebarreService {
  private code: Subject<string|undefined>= new Subject<string|undefined>() 


  setCode(data: string): void {
    this.code.next(data)
  }

  getCode(): Observable<string|undefined> {
    return this.code.asObservable();
  }

  clearCode(): void {
    this.code.next("")
  }
}
