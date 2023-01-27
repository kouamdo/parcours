import { DatePipe } from "@angular/common";
import { InMemoryDbService } from "angular-in-memory-web-api";
import { IFonctionnalites } from "../modele/fonctionnalites";
import { IMenus } from "../modele/menus";
import { IPatient } from "../modele/Patient";
import { IService } from "../modele/service";
import { StatutTicket } from "../modele/statut-ticket";
import { ITicket } from "../modele/ticket";

export class InMemDBService implements InMemoryDbService{
  statutTicketActif = StatutTicket.actif
  statutTicketAttente = StatutTicket.attente
  statutTicketTraite = StatutTicket.traite
    createDb(){
        let patients:IPatient[]=[
            {id:"1", nom:"NGONGANG", prenom:"Philippe", sexe:"M", adresse:"Yaoundé", telephone:"090999090", mail:"ngong@yad.fr", dateNaissance: new Date("07/07/1989")},
            {id:"2", nom:"Ouandji", prenom:"tre", sexe:"F", adresse:"Douala", telephone:"090999091", mail:"ouang@yad.fr", dateNaissance: new Date("07/03/1990")}
        ];
        let services:IService[]=[
            {id:1, libelle:"Pharmacie", etat:"non attribue",dateDerniereModification: "07/03/1990",dateAttribution: "07/03/1990",dateFin: "07/03/1990",nombreTotalAttributions: 6},
            {id:2, libelle:"Laboratoire", etat:"non attribue",dateDerniereModification: "07/03/1990",dateAttribution: "07/03/1990",dateFin: "07/03/1990",nombreTotalAttributions: 20},
            {id:3, libelle:"Consultation", etat:"non attribue",dateDerniereModification: "07/03/1990",dateAttribution: "07/03/1990",dateFin: "07/03/1990",nombreTotalAttributions: 50}
        ];
        let tickets:ITicket[]=[
            {id:1, idUnique:"20221206S1A01", date_heure: new Date("01/13/2022"), idFileAttente: "S1A01", idPersonne: "1", statut: this.statutTicketTraite},
            {id:2, idUnique:"20221206S1A02", date_heure: new Date("01/12/2021"), idFileAttente: "S1A01", idPersonne: "2", statut: this.statutTicketActif},
            {id:3, idUnique:"20221206S1A01", date_heure: new Date("01/11/2020"), idFileAttente: "S1A02", idPersonne: "1", statut: this.statutTicketActif},
            {id:4, idUnique:"20221206S1A02", date_heure: new Date("01/14/2023"), idFileAttente: "S1A02", idPersonne: "2", statut: this.statutTicketTraite},
            {id:5, idUnique:"20221206S1A03", date_heure: new Date("01/11/2019"), idFileAttente: "S1A03", idPersonne: "1", statut: this.statutTicketActif},
            {id:6, idUnique:"20221206S1A04", date_heure: new Date("01/14/2018"), idFileAttente: "S1A04", idPersonne: "2", statut: this.statutTicketActif},
            {id:7, idUnique:"20221206S1A03", date_heure: new Date("01/11/2018"), idFileAttente: "S1A03", idPersonne: "1", statut: this.statutTicketActif},
            {id:8, idUnique:"20221206S1A04", date_heure: new Date("01/14/2017"), idFileAttente: "S1A04", idPersonne: "2", statut: this.statutTicketActif},
            {id:9, idUnique:"20221206S1A05", date_heure: new Date("01/11/2017"), idFileAttente: "S1A05", idPersonne: "1", statut: this.statutTicketActif},
            {id:10, idUnique:"20221206S1A06", date_heure: new Date("01/14/2016"), idFileAttente: "S1A06", idPersonne: "2", statut: this.statutTicketActif}
        ];
        let menus:IMenus[] =[ 
          {"idUser":"phil", "langue":"fr","fonctionnalites":[
            {"fonction":"Personne", "icone":"fas fa-user-cog", "actif":"menu-open", "elements":[{"nom":"Créer", "lien":"patient-nouveau", "bouton":"false"}  , {"nom":"Rechercher", "lien":"list-patients", "bouton":"false"}, {"nom":"Modifier", "lien":"patient-nouveau/:idPatient", "bouton":"false"}, {"nom":"Modifier", "lien":"patient-nouveau/:idPatient", "bouton":"false"}]},
            {"fonction":"Service", "icone":"fas fa-user-cog", "actif":"", "elements":[{"nom":"Créer", "lien":"./service-nouveau", "bouton":"false"}  , {"nom":"Rechercher", "lien":"./list-services", "bouton":"false"}, {"nom":"Modifier", "lien":"patient-nouveau/:idPatient", "bouton":"false"}, {"nom":"Modifier", "lien":"patient-nouveau/:idPatient", "bouton":"false"},{"nom":"Orienter", "lien":"patient-nouveau", "bouton":"true"}]},
            {"fonction":"Ticket", "icone":"fas fa-chart-pie", "actif":"", "elements":[{"nom":"Créer", "lien":"patient-nouveau", "bouton":"false"}  , {"nom":"Rechercher", "lien":"list-tickets", "bouton":"false"}, {"nom":"Modifier", "lien":"patient-nouveau/:idPatient", "bouton":"false"}, {"nom":"Modifier", "lien":"patient-nouveau/:idPatient", "bouton":"false"}]}
          ]},
          {"idUser":"phil", "langue":"en","fonctionnalites":[
            {"fonction":"People", "icone":"fas fa-user-cog", "actif":"", "elements":[{"nom":"New", "lien":"patient-nouveau", "bouton":"false"}  , {"nom":"Search", "lien":"list-patients", "bouton":"false"}, {"nom":"Modify", "lien":"patient-nouveau/:idPatient", "bouton":"false"}, {"nom":"Modify", "lien":"patient-nouveau/:idPatient", "bouton":"false"}]},
            {"fonction":"Service", "icone":"fas fa-user-cog", "actif":"menu-open", "elements":[{"nom":"New", "lien":"./service-nouveau", "bouton":"false"}  , {"nom":"Search", "lien":"./list-services", "bouton":"false"}, {"nom":"Modify", "lien":"patient-nouveau/:idPatient", "bouton":"false"}, {"nom":"Modify", "lien":"patient-nouveau/:idPatient", "bouton":"false"},{"nom":"Guide", "lien":"patient-nouveau", "bouton":"true"}]},
            {"fonction":"Ticket", "icone":"fas fa-chart-pie", "actif":"", "elements":[{"nom":"New", "lien":"patient-nouveau", "bouton":"false"}  , {"nom":"Search", "lien":"list-tickets", "bouton":"false"}, {"nom":"Modify", "lien":"patient-nouveau/:idPatient", "bouton":"false"}, {"nom":"Modify", "lien":"patient-nouveau/:idPatient", "bouton":"false"}]}
          ]}
        ];
        return{patients,services, menus, tickets};
    }
}