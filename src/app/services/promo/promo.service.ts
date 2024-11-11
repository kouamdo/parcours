import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { IPromo } from 'src/app/modele/promo-distributeur';
import { IRessource } from 'src/app/modele/ressource';

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
  
  // getPromosByRessource(ressource:IRessource): Observable<IPromo[]> {
  //   return this.http.get<IPromo[]>('api/promo').pipe(
  //     map(x=>
  //       {
  //        return  x.filter((p) => 
  //         p.ressource?.some((r) => (r.id === ressource.id)) ||
  //         p.famille?.some((f) => (f.id === ressource.famille.id))
  //       )
  //       })
  //   );        
  // }
  getPromosByRessource(ressource: IRessource): Observable<IPromo[]> {
    return this.http.get<IPromo[]>('api/promo').pipe(
      map(promos => 
        promos.filter(promo => 
          // Vérifier la correspondance des ressources
          promo.ressource?.some(r => r.id === ressource.id) ||
          // Vérifier la correspondance de la famille si disponible
          (ressource.famille && promo.famille?.some(f => f.id === ressource.famille?.id))
        )
      ),
      catchError(error => {
        // Gérer les erreurs réseau ou serveur
        console.error('Erreur lors de la récupération des promos :', error);
        return of([]); // Retourner un Observable vide en cas d'erreur
      })
    );
  }

  ajouterPromo(promo: IPromo) {
    return this.http.post(this.apiUrl, promo);
    
  }
}
