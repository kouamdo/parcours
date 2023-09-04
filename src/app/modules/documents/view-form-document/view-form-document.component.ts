import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IDocument } from 'src/app/modele/document';
import { DocumentService } from 'src/app/services/documents/document.service';

@Component({
  selector: 'app-view-form-document',
  templateUrl: './view-form-document.component.html',
  styleUrls: ['./view-form-document.component.scss']
})
export class ViewFormDocumentComponent implements OnInit {

  document : IDocument = {
    id: '',
    titre: '',
    description: '',
    missions: [],
    attributs: [],
    categories: [],
    preconisations: []
  };

  constructor(private router:Router, private infosPath:ActivatedRoute, private serviceDocument:DocumentService) {}

  ngOnInit(): void {
    let idDocument = this.infosPath.snapshot.paramMap.get('idDocument');
    console.log("idDocument :" + idDocument);
    if((idDocument != null) && idDocument!==''){
      this.serviceDocument.getDocumentById(idDocument).subscribe(
        x =>{
          this.document = x;
          console.log("Voici le document", this.document);
        });
    }
  }

}
