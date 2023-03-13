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
    attributs: []
  };

  constructor(private router:Router, private infosPath:ActivatedRoute, private serviceDocument:DocumentService) {}

  ngOnInit(): void {
    let IdDocument = this.infosPath.snapshot.paramMap.get('IdDocument');
    if((IdDocument != null) && IdDocument!==''){
      this.serviceDocument.getDocumentById(IdDocument).subscribe(
        x =>{
          this.document = x;
          console.log("Voici le document", this.document);
        });
    }
  }

}
