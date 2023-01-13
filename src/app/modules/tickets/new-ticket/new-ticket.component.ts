import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { IService } from 'src/app/modele/service';
import { ITicket } from 'src/app/modele/ticket';
import { ServicesService } from 'src/app/services/services/services.service';
import { TicketsService } from 'src/app/services/tickets/tickets.service';

@Component({
  selector: 'app-new-ticket',
  templateUrl: './new-ticket.component.html',
  styleUrls: ['./new-ticket.component.scss']
})
export class NewTicketComponent implements OnInit {

  @Input() flag: boolean = false;

  ticket : ITicket|undefined;
  forme: FormGroup;
  btnLibelle: string="Enregister";
  titre: string="Ajouter un nouveau ticket";
  submitted: boolean=false;
  currentDate = new Date;
  strIidPersonne: string = "";
  idPersonne: number = 0;
  nomPersonne : string | null= "";
  id_service : number = 0;
  libelleService : string | null = "";
  id_ticket : number = 0;
  libelle_service : string = "";
  step : any = 1;

  services$:Observable<IService[]>=EMPTY;
  tickets$:Observable<ITicket[]>=EMPTY;
  _ticket : ITicket = {
    id: 0,
    idUnique: '',
    date_heure: new Date,
    idFileAttente: null,
    idPersonne: null,
    statut: ''
  };

  constructor(private formBuilder:FormBuilder, private ticketsService:TicketsService,private router:Router, private infosPath:ActivatedRoute, private serviceService:ServicesService) { 
    this.forme = this.formBuilder.group({ 
      
      statut: ['Actif']
    })
  }

  ngOnInit(): void {
    this.services$ = this.getAllServices();

    let idTicket = this.infosPath.snapshot.paramMap.get('idTicket');
    console.log("idTicket :" + idTicket);
    if((idTicket != null) && idTicket!==''){
      this.btnLibelle="Modifier";
      this.titre="Ticket à Modifier";
      this.ticketsService.getTicketById(Number(idTicket)).subscribe(x =>
        {
          this.ticket = x; console.log(this.ticket);
          this.forme.setValue({
            idUnique: this.ticket.idUnique,
            date_heure: this.ticket.date_heure,
            idFileAttente: this.ticket.idFileAttente,
            idPersonne: this.ticket.idPersonne,
            statut: this.ticket.statut
          })
      });
    }
  }
  get f(){
    return this.forme.controls;
  }
  
  onSubmit(ticketInput:any){
    this.submitted=true;

    this.nomPersonne = sessionStorage.getItem("nom_patient");
    this.libelleService = sessionStorage.getItem("libelle_service");
    //Todo la validation d'element non conforme passe
    if(this.forme.invalid) return;
        
      this.ticketsService.attribuerTicket(sessionStorage.getItem("id_patient"),sessionStorage.getItem("id_service")).subscribe(
        object => {
          this._ticket = object;
          sessionStorage.setItem("idFileAttente", this._ticket.idFileAttente!);
          this._ticket.idPersonne = sessionStorage.getItem("nom_patient");
          //il faut que le nom du service et du patient apparaissent sur le recap pour impression
        }
      )

    this.nextStep();
    //this.removeData();
  }

  nextStep(){
    this.step += this.step;
  }
  previousStep(){
    this.step = this.step - 1;
  }
  private getAllServices(){
    return this.serviceService.getAllServices();
  }
  setLibelleService(id_service : number, libelleService: string){
    this.libelle_service = libelleService;
    this.id_service = id_service;

    sessionStorage.setItem("id_service", this.id_service.toString());
    sessionStorage.setItem("libelle_service", this.libelle_service);
  }
  private   getTicketById(id: number){
    return this.ticketsService.getTicketById(id);
  }
  removeData() {
    sessionStorage.clear();
  }
  imprimer(dinName : string) {
    var printContents = document.getElementById(dinName)!.innerHTML;    
    var originalContents = document.body.innerHTML;      
    document.body.innerHTML = printContents;     
    window.print();
    document.body.innerHTML = originalContents;
  }
}
