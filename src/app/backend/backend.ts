import { DatePipe } from "@angular/common";
import { InMemoryDbService } from "angular-in-memory-web-api";
import { IFonctionnalites } from "../modele/fonctionnalites";
import { IMenus } from "../modele/menus";
import { IPatient } from "../modele/Patient";
import { IService } from "../modele/service";

export class InMemDBService implements InMemoryDbService{
    createDb(){
        let patients:IPatient[]=[
            {id:1, nom:"NGONGANG", prenom:"Philippe", sexe:"M", adresse:"Yaoundé", telephone:"090999090", mail:"ngong@yad.fr", dateNaissance: new Date("07/07/1989")},
            {id:2, nom:"Ouandji", prenom:"tre", sexe:"F", adresse:"Douala", telephone:"090999091", mail:"ouang@yad.fr", dateNaissance: new Date("07/03/1990")},
            {id:3, nom:"Oum", prenom:"tre", sexe:"F", adresse:"Douala", telephone:"090999091", mail:"ouang@yad.fr", dateNaissance: new Date("07/03/1990")},
            {id:4, nom:"Oubian", prenom:"tre", sexe:"F", adresse:"Douala", telephone:"090999091", mail:"ouang@yad.fr", dateNaissance: new Date("07/03/1990")},
            {id:5, nom:"Oum", prenom:"boy", sexe:"F", adresse:"Douala", telephone:"090999091", mail:"ouang@yad.fr", dateNaissance: new Date("07/03/1990")},
            {id:6, nom:"Oubian", prenom:"junior", sexe:"F", adresse:"Douala", telephone:"090999091", mail:"ouang@yad.fr", dateNaissance: new Date("07/03/1990")},
            {id:7, nom:"Oubian", prenom:"senior", sexe:"F", adresse:"Douala", telephone:"090999091", mail:"ouang@yad.fr", dateNaissance: new Date("07/03/1990")},
            {id:8, nom:"Oubian", prenom:"midelle", sexe:"F", adresse:"Douala", telephone:"090999091", mail:"ouang@yad.fr", dateNaissance: new Date("07/03/1990")},
            {id:9, nom:"Oubian", prenom:"tresor", sexe:"F", adresse:"Douala", telephone:"090999091", mail:"ouang@yad.fr", dateNaissance: new Date("07/03/1990")}
        ];
        let services:IService[]=[
            {id:2, libelle:"Pharmacie", etat:"non attribue",dateDerniereModification: "07/03/1990",dateAttribution: "07/03/1990",dateFin: "07/03/1990",nombreTotalAttributions: 6},
            {id:2, libelle:"Laboratoire", etat:"non attribue",dateDerniereModification: "07/03/1990",dateAttribution: "07/03/1990",dateFin: "07/03/1990",nombreTotalAttributions: 20},
            {id:2, libelle:"Consultation", etat:"non attribue",dateDerniereModification: "07/03/1990",dateAttribution: "07/03/1990",dateFin: "07/03/1990",nombreTotalAttributions: 50}
        ];
        let menus:IMenus[] =[ 
          {"idUser":"phil", "langue":"fr","fonctionnalites":[
            {"fonction":"Patient", "icone":"fas fa-user-cog", "actif":"menu-open", "elements":[{"nom":"Créer", "lien":"patient-nouveau", "bouton":"false"}  , {"nom":"Rechercher", "lien":"list-patients", "bouton":"false"}, {"nom":"Modifier", "lien":"patient-nouveau/:idPatient", "bouton":"false"}]},
            {"fonction":"Service", "icone":"fas fa-user-cog", "actif":"", "elements":[{"nom":"Créer", "lien":"./service-nouveau", "bouton":"false"}  , {"nom":"Rechercher", "lien":"./list-services", "bouton":"false"}, {"nom":"Modifier", "lien":"patient-nouveau/:idPatient", "bouton":"false"}]},
            {"fonction":"Ticket", "icone":"fas fa-chart-pie", "actif":"", "elements":[ {"nom":"Rechercher", "lien":"list-tickets", "bouton":"false"}]}
          ]},
          {"idUser":"phil", "langue":"en","fonctionnalites":[
            {"fonction":"People", "icone":"fas fa-user-cog", "actif":"", "elements":[{"nom":"New", "lien":"patient-nouveau", "bouton":"false"}  , {"nom":"Search", "lien":"list-patients", "bouton":"false"}, {"nom":"Modify", "lien":"patient-nouveau/:idPatient", "bouton":"false"}]},
            {"fonction":"Service", "icone":"fas fa-user-cog", "actif":"menu-open", "elements":[{"nom":"New", "lien":"./service-nouveau", "bouton":"false"}  , {"nom":"Search", "lien":"./list-services", "bouton":"false"}, {"nom":"Modify", "lien":"patient-nouveau/:idPatient", "bouton":"false"}]},
            {"fonction":"Ticket", "icone":"fas fa-chart-pie", "actif":"", "elements":[ {"nom":"Search", "lien":"list-tickets", "bouton":"false"}]}
          ]}
        ];
        return{patients,services, menus};
    }
}