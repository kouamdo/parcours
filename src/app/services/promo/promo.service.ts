import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IPromo } from 'src/app/modele/promo-distributeur';

@Injectable({
  providedIn: 'root'
})
export class PromoService {
  private apiUrl = 'api/promo'; 

  constructor(private http: HttpClient) {}

  getAllPromos(): Observable<IPromo[]> {
    return this.http.get<IPromo[]>(this.apiUrl).pipe(map(x => x));
  }

  getPromoById(id: string): Observable<IPromo> {
    return this.getAllPromos().pipe(
      map(x => x.find(p => p.id === id) as IPromo)
    );
  }

  getPromosByCodeUnique(codeUnique: string): Observable<IPromo[]> {
    return this.http.get<IPromo[]>(this.apiUrl).pipe(
      map(x => x.filter(p => p.codeUnique.toLowerCase().startsWith(codeUnique)))
    );
  }

  getPromoByIdAssurance(idAssurance: string): Observable<IPromo> {
    return this.getAllPromos().pipe(
      map(x => x.find(p => p.emetteur.id.toLowerCase() == idAssurance) as IPromo)
    );
  }

  getPromoByRaisonSocialAssurance(raisonSocialAssurance: string): Observable<IPromo[]> {
    return this.http.get<IPromo[]>(this.apiUrl).pipe(
      map(x =>{ return  x.filter(p => p.emetteur.raisonSocial.toLowerCase().startsWith(raisonSocialAssurance))})
    );
  }

  ajouterPromo(promo: IPromo) {
    return this.http.post(this.apiUrl, promo);
    
  }
}
