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
  id_service : number = 0;
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
    idPersonne: null
  };

  constructor(private formBuilder:FormBuilder, private ticketsService:TicketsService,private router:Router, private infosPath:ActivatedRoute, private serviceService:ServicesService) { 
    this.forme = this.formBuilder.group({
      idUnique: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      date_heure: [this.currentDate, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      idFileAttente: [],
      idPersonne: [],
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
            idPersonne: this.ticket.idPersonne
          })
      });
    }
  }
  get f(){
    return this.forme.controls;
  }
  onSubmit(ticketInput:any){
    this.submitted=true;
    //Todo la validation d'element non conforme passe
    if(this.forme.invalid) return;

    let ticketTemp : ITicket={
      id: Number(9),
      idUnique: ticketInput.idUnique,
      date_heure: new Date,
      idFileAttente: sessionStorage.getItem("id_service"),
      idPersonne: sessionStorage.getItem("id_patient")
    }

    this._ticket = ticketTemp;

    if ((sessionStorage.getItem("id_patient") != undefined) && (sessionStorage.getItem("id_service") != undefined)) {
        
      this.ticketsService.attribuerTicket(sessionStorage.getItem("id_patient"),sessionStorage.getItem("id_service")).subscribe(
        object => {
          this._ticket = object;
          /*this._ticket.id = object.id
          this._ticket.idUnique = object.idUnique
          this._ticket.date_heure = object.date_heure
          this._ticket.idFileAttente = object.idFileAttente
          this._ticket.idPersonne = object.idPersonne*/
    sessionStorage.setItem("idFileAttente", this._ticket.idFileAttente!);
        },
        error =>{
          console.log(error)
        }
      )

    }
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
}
