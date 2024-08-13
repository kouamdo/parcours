import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { IExemplaireDocument } from 'src/app/modele/exemplaire-document';
import { IOrdreEtat } from 'src/app/modele/ordreEtat';
import { DocumentService } from '../documents/document.service';
import { IDocument } from 'src/app/modele/document';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ExemplaireDocumentService {
  res!: boolean;
  i!: number;
  ordreEtat!: IOrdreEtat;
  constructor(
    private http: HttpClient,
    private documentService: DocumentService,
    private datePipe: DatePipe
  ) {}

  getAllExemplaireDocuments(): Observable<IExemplaireDocument[]> {
    return this.http.get<IExemplaireDocument[]>('api/exemplaires');
  }

  getExemplaireDocumentById(id: string): Observable<IExemplaireDocument> {
    return this.getAllExemplaireDocuments().pipe(
      map((x) => {
        return x.find((d) => d.id == id) as IExemplaireDocument;
      })
    );
  }

  getExemplaireDocumentByOrder(exemplaire: IExemplaireDocument, doc: IDocument) {
    if (exemplaire.ordreEtats != undefined) {
      
    this.ordreEtat = exemplaire.ordreEtats![exemplaire.ordreEtats!.length - 1];
          
      for (let index = 0; index < doc.docEtats.length; index++) {
        if (doc.docEtats[index].etat.id == this.ordreEtat.etat.id) {
          this.i = index;
        }
      }
      if (doc.docEtats[this.i].validation != undefined) {
        this.res = true;
      } else {
        this.res = false;
      }
    }
      return { ele: this.ordreEtat, sol: this.res, in: this.i };
  }
  
  getExemplaireDocumentByIdPersonneRatachee(idPersonne:string): Observable<IExemplaireDocument[]> {
    return this.http.get<IExemplaireDocument[]>('api/exemplaires').pipe(
      map(x=>
        {
          return x.filter(e=> e.personneRattachee?.id.toLowerCase() == idPersonne)
        })
    );        
  }

  getExemplaireDocumentByTitre(
    titre: string
  ): Observable<IExemplaireDocument[]> {
    return this.http.get<IExemplaireDocument[]>('api/exemplaires').pipe(
      map((x) => {
        return x.filter((e) => e.titre.toLowerCase().startsWith(titre));
      })
    );
  }

  ajouterExemplaireDocument(exemplaire: IExemplaireDocument) {
    return this.http.post('api/exemplaires', exemplaire);
  }

  // Methode permettant de creer le code de l'exemplaire en fonction du format de code
  formatCode(date: Date): string | null {
    
    // Formatter la date en format short
    let formattedDate = this.datePipe.transform(date, 'ddMMyy');
    // Formatter l'heure en format hhmmss
    let formattedTime = this.datePipe.transform(date, 'HHmmss');
    //code final
    let code : string = ''
    
    // Retirer les caractères spéciaux de la date
    if (formattedDate) {
      formattedDate = formattedDate.replace(/[^a-zA-Z0-9]/g, '');
      formattedTime = formattedTime!.replace(/[^a-zA-Z0-9]/g, '');
      code = formattedDate +'_'+ formattedTime
    }

    // Combiner la date et l'heure
    return code
  }
}
