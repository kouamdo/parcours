import { DatePipe } from "@angular/common";
import { InMemoryDbService } from "angular-in-memory-web-api";
import { IPatient } from "../modele/Patient";

export class InMemDBService implements InMemoryDbService{
    createDb(){
        let patients:IPatient[]=[
            {id:1, nom:"NGONGANG", prenom:"Philippe", sexe:"M", adresse:"Yaoundé", telephone:"090999090", mail:"ngong@yad.fr", dateNaissance: "07/07/1989"},
            {id:2, nom:"Ouandji", prenom:"tre", sexe:"F", adresse:"Douala", telephone:"090999091", mail:"ouang@yad.fr", dateNaissance: "07/03/1990"}
        ];
        return{patients};
    }
}