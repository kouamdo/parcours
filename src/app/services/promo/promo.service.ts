import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Promo } from 'src/app/modele/promo-distributeur';

@Injectable({
  providedIn: 'root'
})
export class PromoService {
  private apiUrl = 'api/promo'; 

  constructor(private http: HttpClient) {}

  getAllPromos(): Observable<Promo[]> {
    return this.http.get<Promo[]>(this.apiUrl).pipe(map(x => x));
  }

  getPromoById(id: string): Observable<Promo> {
    return this.getAllPromos().pipe(
      map(x => x.find(p => p.id === id) as Promo)
    );
  }

  getPromosByCodeUnique(codeUnique: string): Observable<Promo[]> {
    return this.http.get<Promo[]>(this.apiUrl).pipe(
      map(x => x.filter(p => p.codeUnique.toLowerCase().startsWith(codeUnique)))
    );
  }

  ajouterPromo(promo: Promo) {
    console.log("promo new", promo);
    return this.http.post(this.apiUrl, promo);
    
  }
}
