import { DatePipe } from "@angular/common";
import { InMemoryDbService } from "angular-in-memory-web-api";
import { IAttributs } from "../modele/attributs";
import { IDocument } from "../modele/document";
import { IFonctionnalites } from "../modele/fonctionnalites";
import { IMenus } from "../modele/menus";
import { IMission } from "../modele/mission";
import { IPatient } from "../modele/Patient";
import { IService } from "../modele/service";
import { StatutTicket } from "../modele/statut-ticket";
import { ITicket } from "../modele/ticket";
import { TypeTicket } from "../modele/type-ticket";

export class InMemDBService implements InMemoryDbService{
  statutTicketActif = StatutTicket.actif
  statutTicketAttente = StatutTicket.attente
  statutTicketTraite = StatutTicket.traite
  
  typeInt = TypeTicket.Int;
  typeString = TypeTicket.String;
  typeDouble = TypeTicket.Double;
  typeFloat = TypeTicket.Float;
  typeBoolean = TypeTicket.Boolean;
  typeDate = TypeTicket.Date;

    createDb(){
        let patients:IPatient[]=[
            {id:"1", nom:"NGONGANG", prenom:"Philippe", sexe:"M", adresse:"Yaoundé", telephone:"090999090", mail:"ngong@yad.fr", dateNaissance: new Date("07/07/1989")},
            {id:"2", nom:"Ouandji", prenom:"tre", sexe:"F", adresse:"Douala", telephone:"090999091", mail:"ouang@yad.fr", dateNaissance: new Date("07/03/1990")},
            {id:"3", nom:"Oum", prenom:"tre", sexe:"F", adresse:"Douala", telephone:"090999091", mail:"ouang@yad.fr", dateNaissance: new Date("07/03/1990")},
            {id:"4", nom:"Oubian", prenom:"tre", sexe:"F", adresse:"Douala", telephone:"090999091", mail:"ouang@yad.fr", dateNaissance: new Date("07/03/1990")},
            {id:"5", nom:"Oum", prenom:"boy", sexe:"F", adresse:"Douala", telephone:"090999091", mail:"ouang@yad.fr", dateNaissance: new Date("07/03/1990")},
            {id:"6", nom:"Oubian", prenom:"junior", sexe:"F", adresse:"Douala", telephone:"090999091", mail:"ouang@yad.fr", dateNaissance: new Date("07/03/1990")},
            {id:"7", nom:"Oubian", prenom:"senior", sexe:"F", adresse:"Douala", telephone:"090999091", mail:"ouang@yad.fr", dateNaissance: new Date("07/03/1990")},
            {id:"8", nom:"Oubian", prenom:"midelle", sexe:"F", adresse:"Douala", telephone:"090999091", mail:"ouang@yad.fr", dateNaissance: new Date("07/03/1990")},
            {id:"9", nom:"Oubian", prenom:"tresor", sexe:"F", adresse:"Douala", telephone:"090999091", mail:"ouang@yad.fr", dateNaissance: new Date("07/03/1990")}
        ];
        let services:IService[]=[
            {id:"1", libelle:"Pharmacie", etat:"non attribue",dateDerniereModification: "07/03/2000",dateAttribution: "07/03/1990",dateFin: "07/03/1990",nombreTotalAttributions: 6},
            {id:"2", libelle:"Laboratoire", etat:"non attribue",dateDerniereModification: "06/08/1990",dateAttribution: "07/03/1990",dateFin: "07/03/1990",nombreTotalAttributions: 20},
            {id:"3", libelle:"Consultation", etat:"non attribue",dateDerniereModification: "12/06/1972",dateAttribution: "07/03/1990",dateFin: "07/03/1990",nombreTotalAttributions: 50}
        ];
        let tickets:ITicket[]=[
            {id:"1", idUnique:"20221206S1A01", date_heure: new Date("01/13/2022"), idFileAttente: "S1A01", idPersonne: "1", statut: this.statutTicketTraite},
            {id:"2", idUnique:"20221206S1A02", date_heure: new Date("01/12/2021"), idFileAttente: "S1A01", idPersonne: "2", statut: this.statutTicketActif},
            {id:"3", idUnique:"20221206S1A01", date_heure: new Date("01/11/2020"), idFileAttente: "S1A02", idPersonne: "1", statut: this.statutTicketActif},
            {id:"4", idUnique:"20221206S1A02", date_heure: new Date("01/14/2023"), idFileAttente: "S1A02", idPersonne: "2", statut: this.statutTicketTraite},
            {id:"5", idUnique:"20221206S1A03", date_heure: new Date("01/11/2019"), idFileAttente: "S1A03", idPersonne: "1", statut: this.statutTicketActif},
            {id:"6", idUnique:"20221206S1A04", date_heure: new Date("01/14/2018"), idFileAttente: "S1A04", idPersonne: "2", statut: this.statutTicketActif},
            {id:"7", idUnique:"20221206S1A03", date_heure: new Date("01/11/2018"), idFileAttente: "S1A03", idPersonne: "1", statut: this.statutTicketAttente},
            {id:"8", idUnique:"20221206S1A04", date_heure: new Date("01/14/2017"), idFileAttente: "S1A04", idPersonne: "2", statut: this.statutTicketAttente},
            {id:"9", idUnique:"20221206S1A05", date_heure: new Date("01/11/2017"), idFileAttente: "S1A05", idPersonne: "1", statut: this.statutTicketAttente},
            {id:"10", idUnique:"20221206S1A06", date_heure: new Date("01/14/2016"), idFileAttente: "S1A06", idPersonne: "2", statut: this.statutTicketAttente}
        ];
        let menus:IMenus[] =[ 
          {"idUser":"phil", "langue":"fr","fonctionnalites":[
            {"fonction":"Personne", "icone":"fas fa-user-cog", "actif":"menu-close", "elements":[{"nom":"Créer", "lien":"patient-nouveau", "bouton":"false"}  , {"nom":"Rechercher", "lien":"list-patients", "bouton":"false"}]},
            {"fonction":"Service", "icone":"fas fa-user-cog", "actif":"", "elements":[{"nom":"Créer", "lien":"./service-nouveau", "bouton":"false"}  , {"nom":"Rechercher", "lien":"./list-services", "bouton":"false"}]},
            {"fonction":"Ticket", "icone":"fas fa-chart-pie", "actif":"", "elements":[{"nom":"Rechercher", "lien":"list-tickets", "bouton":"false"}, {"nom":"Afficher le panneau", "lien":"panneau-tickets", "bouton":"false"}]},
            {"fonction":"Attribut", "icone":"fas fa-user-cog", "actif":"", "elements":[{"nom":"Créer", "lien":"./attribut-nouveau", "bouton":"false"}  , {"nom":"Rechercher", "lien":"./list-attributs", "bouton":"false"}]},
            {"fonction":"Mission", "icone":"fas fa-user-cog", "actif":"", "elements":[{"nom":"Créer", "lien":"./mission-nouveau", "bouton":"false"}  , {"nom":"Rechercher", "lien":"./list-missions", "bouton":"false"}]},
            {"fonction":"Documents", "icone":"fas fa-user-cog", "actif":"", "elements":[{"nom":"Créer model documents", "lien":"./document-nouveau", "bouton":"false"}, {"nom":"Rechercher", "lien":"./list-documents", "bouton":"false"}]}
          ]},
          {"idUser":"phil", "langue":"en","fonctionnalites":[
            {"fonction":"People", "icone":"fas fa-user-cog", "actif":"menu-close", "elements":[{"nom":"New", "lien":"patient-nouveau", "bouton":"false"}  , {"nom":"Search", "lien":"list-patients", "bouton":"false"}]},
            {"fonction":"Service", "icone":"fas fa-user-cog", "actif":"", "elements":[{"nom":"New", "lien":"./service-nouveau", "bouton":"false"}  , {"nom":"Search", "lien":"./list-services", "bouton":"false"}]},
            {"fonction":"Ticket", "icone":"fas fa-chart-pie", "actif":"", "elements":[{"nom":"Search", "lien":"list-tickets", "bouton":"false"}, {"nom":"View panel", "lien":"panneau-tickets", "bouton":"false"}]},
            {"fonction":"Attribut", "icone":"fas fa-user-cog", "actif":"", "elements":[{"nom":"New", "lien":"./attribut-nouveau", "bouton":"false"}  , {"nom":"Search", "lien":"./list-attributs", "bouton":"false"}]},
            {"fonction":"Mission", "icone":"fas fa-user-cog", "actif":"", "elements":[{"nom":"New", "lien":"./mission-nouveau", "bouton":"false"}  , {"nom":"Search", "lien":"./list-missions", "bouton":"false"}]},
            {"fonction":"Documents", "icone":"fas fa-user-cog", "actif":"", "elements":[{"nom":"New document's model", "lien":"./document-nouveau", "bouton":"false"}, {"nom":"Search", "lien":"./list-documents", "bouton":"false"}]}
          ]}
        ];
        let missions:IMission[]=[
          {id:"1", libelle:"fiche de soin", description:"fiche de soin est une mission", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), 
            service : {id:"1", libelle:"Pharmacie", etat:"non attribue",dateDerniereModification: "07/03/2000",dateAttribution: "07/03/1990",dateFin: "07/03/1990",nombreTotalAttributions: 6}},
          {id:"2", libelle:"ordonnance", description:"ordonnance est une mission", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), 
            service : {id:"2", libelle:"Laboratoire", etat:"non attribue",dateDerniereModification: "06/08/1990",dateAttribution: "07/03/1990",dateFin: "07/03/1990",nombreTotalAttributions: 20}},
          {id:"3", libelle:"bon de commande", description:"bon de commande est une mission", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), 
            service : {id:"3", libelle:"Consultation", etat:"non attribue",dateDerniereModification: "12/06/1972",dateAttribution: "07/03/1990",dateFin: "07/03/1990",nombreTotalAttributions: 50}},
          {id:"4", libelle:"recu de paiement", description:"recu de paiement est une mission", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), 
            service : {id:"1", libelle:"Pharmacie", etat:"non attribue",dateDerniereModification: "07/03/2000",dateAttribution: "07/03/1990",dateFin: "07/03/1990",nombreTotalAttributions: 6}},
          {id:"5", libelle:"bulletin d'hospitalisation", description:"bulletin d'hospitalisation est une mission", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990") ,
            service : {id:"3", libelle:"Consultation", etat:"non attribue",dateDerniereModification: "12/06/1972",dateAttribution: "07/03/1990",dateFin: "07/03/1990",nombreTotalAttributions: 50}},
          {id:"6", libelle:"bon de sortie", description:"bon de sortie est une mission", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"),
            service : {id:"1", libelle:"Pharmacie", etat:"non attribue",dateDerniereModification: "07/03/2000",dateAttribution: "07/03/1990",dateFin: "07/03/1990",nombreTotalAttributions: 6}}
        ];
        let attributs:IAttributs[]=[
          {id:"1", titre:"taille", description:"taille de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeDouble},
          {id:"2", titre:"poids", description:"poids de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeDouble},
          {id:"3", titre:"sexe", description:"sexe de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeString},
          {id:"4", titre:"age", description:"age de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeDouble},
          {id:"5", titre:"allergies", description:"allergies de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeString},
          {id:"6", titre:"teint", description:"teint de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeString},
          {id:"7", titre:"Groupe sangin", description:"Groupe sangin de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeString},
          {id:"8", titre:"cicatrice", description:"cicatrice de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeBoolean}
        ];
        let documents:IDocument[]=[
          {id:"1", titre:"document 1", description:"Document delivre par le medecin ou un infirmier de l'etablissement",
           missions:[{id:"1", libelle:"fiche de soin", description:"fiche de soin est une mission", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), 
                      service : {id:"3", libelle:"Consultation", etat:"non attribue",dateDerniereModification: "12/06/1972",dateAttribution: "07/03/1990",dateFin: "07/03/1990",nombreTotalAttributions: 50}},
                    {id:"3", libelle:"bon de commande", description:"bon de commande est une mission", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), 
                      service : {id:"1", libelle:"Pharmacie", etat:"non attribue",dateDerniereModification: "07/03/2000",dateAttribution: "07/03/1990",dateFin: "07/03/1990",nombreTotalAttributions: 6}},
                    {id:"4", libelle:"recu de paiement", description:"recu de paiement est une mission", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), 
                      service : {id:"2", libelle:"Laboratoire", etat:"non attribue",dateDerniereModification: "06/08/1990",dateAttribution: "07/03/1990",dateFin: "07/03/1990",nombreTotalAttributions: 20}}
            ], 
           attributs:[{id:"1", titre:"taille", description:"taille de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeDouble},
                      {id:"4", titre:"age", description:"age de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeDouble},
                      {id:"5", titre:"allergies", description:"allergies de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeString},
                      {id:"6", titre:"teint", description:"teint de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeString},
                      {id:"7", titre:"Groupe sangin", description:"Groupe sangin de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeString},
                      {id:"8", titre:"cicatrice", description:"cicatrice de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeBoolean}
            ]
          },
          {id:"2", titre:"document 2", description:"Document delivre par le medecin ou un infirmier de l'etablissement",
           missions:[{id:"1", libelle:"fiche de soin", description:"fiche de soin est une mission", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), 
                      service : {id:"3", libelle:"Consultation", etat:"non attribue",dateDerniereModification: "12/06/1972",dateAttribution: "07/03/1990",dateFin: "07/03/1990",nombreTotalAttributions: 50}},
                    {id:"3", libelle:"bon de commande", description:"bon de commande est une mission", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"),
                      service : {id:"2", libelle:"Laboratoire", etat:"non attribue",dateDerniereModification: "06/08/1990",dateAttribution: "07/03/1990",dateFin: "07/03/1990",nombreTotalAttributions: 20}},
                    {id:"4", libelle:"recu de paiement", description:"recu de paiement est une mission", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), 
                      service : {id:"2", libelle:"Laboratoire", etat:"non attribue",dateDerniereModification: "06/08/1990",dateAttribution: "07/03/1990",dateFin: "07/03/1990",nombreTotalAttributions: 20}},
            ], 
           attributs:[{id:"1", titre:"taille", description:"taille de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeDouble},
                      {id:"6", titre:"teint", description:"teint de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeString},
                      {id:"8", titre:"cicatrice", description:"cicatrice de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeBoolean},
                      {id:"4", titre:"age", description:"age de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeDouble},
                      {id:"7", titre:"Groupe sangin", description:"Groupe sangin de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeString},
                      {id:"5", titre:"allergies", description:"allergies de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeString}
            ]
          },
          {id:"3", titre:"document 3", description:"Document delivre par le medecin ou un infirmier de l'etablissement",
           missions:[{id:"1", libelle:"fiche de soin", description:"fiche de soin est une mission", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"),
                      service :{id:"3", libelle:"Consultation", etat:"non attribue",dateDerniereModification: "12/06/1972",dateAttribution: "07/03/1990",dateFin: "07/03/1990",nombreTotalAttributions: 50}},
                    {id:"3", libelle:"bon de commande", description:"bon de commande est une mission", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"),
                      service :{id:"3", libelle:"Consultation", etat:"non attribue",dateDerniereModification: "12/06/1972",dateAttribution: "07/03/1990",dateFin: "07/03/1990",nombreTotalAttributions: 50}},
                    {id:"4", libelle:"recu de paiement", description:"recu de paiement est une mission", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"),
                      service :{id:"3", libelle:"Consultation", etat:"non attribue",dateDerniereModification: "12/06/1972",dateAttribution: "07/03/1990",dateFin: "07/03/1990",nombreTotalAttributions: 50}}
            ], 
           attributs:[{id:"1", titre:"taille", description:"taille de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeDouble},
                      {id:"4", titre:"age", description:"age de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeDouble},
                      {id:"5", titre:"allergies", description:"allergies de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeString},
                      {id:"8", titre:"cicatrice", description:"cicatrice de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeBoolean}
            ]
          }
        ];
        return{patients, services, menus, tickets, missions, attributs, documents};
    }
}