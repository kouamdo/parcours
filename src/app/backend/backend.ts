import { DatePipe } from "@angular/common";
import { InMemoryDbService } from "angular-in-memory-web-api";
import { IPatient } from "../modele/Patient";
import { IService } from "../modele/service";
import { ITicket } from "../modele/ticket";

export class InMemDBService implements InMemoryDbService{
    createDb(){
        let patients:IPatient[]=[
            {id:1, nom:"NGONGANG", prenom:"Philippe", sexe:"M", adresse:"Yaoundé", telephone:"090999090", mail:"ngong@yad.fr", dateNaissance: new Date("07/07/1989")},
            {id:2, nom:"Ouandji", prenom:"tre", sexe:"F", adresse:"Douala", telephone:"090999091", mail:"ouang@yad.fr", dateNaissance: new Date("07/03/1990")}
        ];
        let services:IService[]=[
            {id:1, libelle:"Pharmacie", etat:"non attribue",dateDerniereModification: "07/03/1990",dateAttribution: "07/03/1990",dateFin: "07/03/1990",nombreTotalAttributions: 6},
            {id:2, libelle:"Laboratoir", etat:"non attribue",dateDerniereModification: "07/03/1990",dateAttribution: "07/03/1990",dateFin: "07/03/1990",nombreTotalAttributions: 20},
            {id:3, libelle:"Consultation", etat:"non attribue",dateDerniereModification: "07/03/1990",dateAttribution: "07/03/1990",dateFin: "07/03/1990",nombreTotalAttributions: 50}
        ];
        let tickets:ITicket[]=[
            {id:1, idUnique:"20221206S1A01", date_heure: new Date(), idFileAttente: "S1A01", idPersonne: "1"},
            {id:2, idUnique:"20221206S1A02", date_heure: new Date(), idFileAttente: "S1A01", idPersonne: "2"},
            {id:3, idUnique:"20221206S1A01", date_heure: new Date(), idFileAttente: "S1A02", idPersonne: "1"},
            {id:4, idUnique:"20221206S1A02", date_heure: new Date(), idFileAttente: "S1A02", idPersonne: "2"}
        ];
        return{patients,services, tickets};
    }
}