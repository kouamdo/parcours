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
import { IRessource } from "../modele/ressource";
import { IPrecoMvtQte } from "../modele/precomvtqte";
//import { TypeMvt } from "../modele/type-mvt";
import { IPrecoMvt } from "../modele/precomvt";
import { Unites } from "../modele/unites";
import { IFamille } from "../modele/famille";
import { IExemplaireDocument } from "../modele/exemplaire-document";


// { IExemplaireDocument } from "../modele/exemplaire-document";
//import { IFamille } from "../modele/famille";
import { IDistributeur } from "../modele/distributeur";

export class InMemDBService implements InMemoryDbService{
  statutTicketActif = StatutTicket.actif
  statutTicketAttente = StatutTicket.attente
  statutTicketTraite = StatutTicket.traite

  typeInt = TypeTicket.Int;
  typeString = TypeTicket.String;
  typeDouble = TypeTicket.Double;
  typeFloat = TypeTicket.Float;
  typeBoolean = TypeTicket.Boolean;
  typeDate = TypeTicket.Date;;
  typeEmail = TypeTicket.Email;;
  typeRadio = TypeTicket.Radio;;
  typeTel = TypeTicket.Tel;
  typeUrl = TypeTicket.Url;
  typeTextarea = TypeTicket.Textarea;

  /*TypeMvtNeutre = TypeMvt.neutre
  TypeMvtAjout = TypeMvt.ajout
  TypeMvtReduire = TypeMvt.reduire*/

  UnitesLitre = Unites.litre
  UnitesKg = Unites.kg
  UnitesTonne = Unites.tonne

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
            {id:"1", libelle:"Pharmacie", etat:"non attribue",dateDerniereModification: new Date("07/03/2000"),dateAttribution: new Date("07/03/1990"),dateFin: new Date("07/03/1990"),nombreTotalAttributions: 6},
            {id:"2", libelle:"Laboratoire", etat:"non attribue",dateDerniereModification: new Date("06/08/1990"),dateAttribution: new Date("07/03/1990"),dateFin: new Date("07/03/1990"),nombreTotalAttributions: 20},
            {id:"3", libelle:"Consultation", etat:"non attribue",dateDerniereModification: new Date("12/06/1972"),dateAttribution: new Date("07/03/1990"),dateFin: new Date("07/03/1990"),nombreTotalAttributions: 50}
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
            {id:"10", idUnique:"20221206S1A06", date_heure: new Date("01/14/2016"), idFileAttente: "S1A06", idPersonne: "2",statut: this.statutTicketAttente}
        ];
        let menus:IMenus[] =[
          {"idUser":"phil", "langue":"fr","fonctionnalites":[
            {"fonction":"Personne", "icone":"fas fa-user-cog", "actif":"menu-close", "elements":[{"nom":"Créer", "lien":"patient-nouveau", "bouton":"false"}  , {"nom":"Rechercher", "lien":"list-patients", "bouton":"false"}]},
            {"fonction":"Service", "icone":"fas fa-user-cog", "actif":"", "elements":[{"nom":"Créer", "lien":"./service-nouveau", "bouton":"false"}  , {"nom":"Rechercher", "lien":"./list-services", "bouton":"false"}]},
            {"fonction":"Ticket", "icone":"fas fa-chart-pie", "actif":"", "elements":[{"nom":"Rechercher", "lien":"list-tickets", "bouton":"false"}, {"nom":"Afficher le panneau", "lien":"panneau-tickets", "bouton":"false"}]},
            {"fonction":"Attribut", "icone":"fas fa-user-cog", "actif":"", "elements":[{"nom":"Créer", "lien":"./attribut-nouveau", "bouton":"false"}  , {"nom":"Rechercher", "lien":"./list-attributs", "bouton":"false"}]},
            {"fonction":"Mission", "icone":"fas fa-user-cog", "actif":"", "elements":[{"nom":"Créer", "lien":"./mission-nouveau", "bouton":"false"}  , {"nom":"Rechercher", "lien":"./list-missions", "bouton":"false"}]},
            {"fonction":"Documents", "icone":"fas fa-user-cog", "actif":"", "elements":[{"nom":"Créer model documents", "lien":"./document-nouveau", "bouton":"false"}, {"nom":"Rechercher", "lien":"./list-documents", "bouton":"false"}]},
            {"fonction":"Categorie", "icone":"fas fa-user-cog", "actif":"", "elements":[{"nom":"Créer", "lien":"famille-nouvelle", "bouton":"false"}, {"nom":"Rechercher", "lien":"./list-familles", "bouton":"false"}]},
            {"fonction":"Ressource", "icone":"fas fa-user-cog", "actif":"", "elements":[{"nom":"Créer", "lien":"ressource-nouvelle", "bouton":"false"},{"nom":"Rechercher", "lien":"./list-ressources", "bouton":"false"}]},
            {"fonction":"Préconisations","icone":"fas fa-user-cog", "actif":"", "elements":[{"nom":"Créer", "lien":"precomvt-nouvelle", "bouton":"false"},{"nom":"Rechercher", "lien":"./list-precomvts", "bouton":"false"}]},
            {"fonction":"Mission", "icone":"fas fa-user-cog", "actif":"", "elements":[{"nom":"Créer", "lien":"./mission-nouveau", "bouton":"false"}  , {"nom":"Rechercher", "lien":"./list-missions", "bouton":"false"}, {"nom":"Exécuter", "lien":"./executer-missions", "bouton":"false"}]},
            {"fonction":"Documents", "icone":"fas fa-user-cog", "actif":"", "elements":[{"nom":"Créer model documents", "lien":"./document-nouveau", "bouton":"false"}, {"nom":"Rechercher", "lien":"./list-documents", "bouton":"false"}, {"nom":"Creer un exemplaire", "lien":"exemplaire-nouveau/1", "bouton":"false"}, {"nom":"liste des exemplaires", "lien":"./list-exemplaire", "bouton":"false"}]},
            {"fonction":"Distributeur", "icone":"fas fa-user-cog", "actif":"", "elements":[{"nom":"Créer", "lien":"distributeur-nouveau", "bouton":"false"},{"nom":"Rechercher", "lien":"./list-distributeurs", "bouton":"false"}]},
          ]},


          {"idUser":"phil", "langue":"en","fonctionnalites":[
            {"fonction":"People", "icone":"fas fa-user-cog", "actif":"menu-close", "elements":[{"nom":"New", "lien":"patient-nouveau", "bouton":"false"}  , {"nom":"Search", "lien":"list-patients", "bouton":"false"}]},
            {"fonction":"Service", "icone":"fas fa-user-cog", "actif":"", "elements":[{"nom":"New", "lien":"./service-nouveau", "bouton":"false"}  , {"nom":"Search", "lien":"./list-services", "bouton":"false"}]},
            {"fonction":"Ticket", "icone":"fas fa-chart-pie", "actif":"", "elements":[{"nom":"Search", "lien":"list-tickets", "bouton":"false"}, {"nom":"View panel", "lien":"panneau-tickets", "bouton":"false"}]},
            {"fonction":"Attribut", "icone":"fas fa-user-cog", "actif":"", "elements":[{"nom":"New", "lien":"./attribut-nouveau", "bouton":"false"}  , {"nom":"Search", "lien":"./list-attributs", "bouton":"false"}]},
            {"fonction":"Mission", "icone":"fas fa-user-cog", "actif":"", "elements":[{"nom":"New", "lien":"./mission-nouveau", "bouton":"false"}  , {"nom":"Search", "lien":"./list-missions", "bouton":"false"}]},
            {"fonction":"Documents", "icone":"fas fa-user-cog", "actif":"", "elements":[{"nom":"New document's model", "lien":"./document-nouveau", "bouton":"false"}, {"nom":"Search", "lien":"./list-documents", "bouton":"false"}]},

            {"fonction":"Ressource", "icone":"fas fa-user-cog", "actif":"", "elements":[{"nom":"Créer", "lien":"ressource-nouvelle", "bouton":"false"},{"nom":"Search", "lien":"./list-ressources", "bouton":"false"}]},
            {"fonction":"Préconisations","icone":"fas fa-user-cog", "actif":"", "elements":[{"nom":"Créer", "lien":"precomvt-nouvelle", "bouton":"false"}, {"nom":"Search", "lien":"./list-precomvts", "bouton":"false"}]},
            {"fonction":"Mission", "icone":"fas fa-user-cog", "actif":"", "elements":[{"nom":"New", "lien":"./mission-nouveau", "bouton":"false"}  , {"nom":"Search", "lien":"./list-missions", "bouton":"false"}, {"nom":"Execute", "lien":"./executer-missions", "bouton":"false"}]},
            {"fonction":"Documents", "icone":"fas fa-user-cog", "actif":"", "elements":[{"nom":"New document's model", "lien":"./document-nouveau", "bouton":"false"}, {"nom":"Search", "lien":"./list-documents", "bouton":"false"}, {"nom":"Creat an exemplaire", "lien":"exemplaire-nouveau/1", "bouton":"false"}, {"nom":"list of exemplaires", "lien":"./list-exemplaire", "bouton":"false"}]},

          ]}
        ];
        let missions:IMission[]=[
          {id:"1", libelle:"Consultation", description:"Consultation faite par une infirmière", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), idLogin: "admin",
            service : {id:"1", libelle:"Pharmacie", etat:"non attribue",dateDerniereModification: new Date("07/03/2000"),dateAttribution: new Date("07/03/1990"),dateFin: new Date("07/03/1990"),nombreTotalAttributions: 6}},
          {id:"2", libelle:"Consultation Spécialiste", description:"Consultation faite par un médecin", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990") , idLogin: "admin",
            service : {id:"2", libelle:"Laboratoire", etat:"non attribue",dateDerniereModification: new Date("06/08/1990"),dateAttribution: new Date("07/03/1990"),dateFin: new Date("07/03/1990"),nombreTotalAttributions: 20}},
          {id:"3", libelle:"Prelevement Labo", description:"Prélévement fait par laboratoire", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"),  idLogin: "admin",
            service : {id:"3", libelle:"Consultation", etat:"non attribue",dateDerniereModification: new Date("12/06/1972"),dateAttribution: new Date("07/03/1990"),dateFin: new Date("07/03/1990"),nombreTotalAttributions: 50}},
          {id:"4", libelle:"Encaissement", description:"recu de paiement lié à une mission", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"),  idLogin: "admin",
            service : {id:"1", libelle:"Pharmacie", etat:"non attribue",dateDerniereModification: new Date("07/03/2000"),dateAttribution: new Date("07/03/1990"),dateFin: new Date("07/03/1990"),nombreTotalAttributions: 6}},
          {id:"5", libelle:"Resultat Labo", description:"Communiquer les résultats du labo aux patients", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990") , idLogin: "admin",
            service : {id:"3", libelle:"Consultation", etat:"non attribue",dateDerniereModification: new Date("12/06/1972"),dateAttribution: new Date("07/03/1990"),dateFin: new Date("07/03/1990"),nombreTotalAttributions: 50}},
          {id:"6", libelle:"Hospitalisation", description:"bon d'entrée et de sortie est une mission", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), idLogin: "admin",
            service : {id:"1", libelle:"Pharmacie", etat:"non attribue",dateDerniereModification: new Date("07/03/2000"),dateAttribution: new Date("07/03/1990"),dateFin: new Date("07/03/1990"),nombreTotalAttributions: 6}}
        ];
        let attributs:IAttributs[]=[
          {id:"1", titre:"taille", description:"taille de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeDouble, ordre:0, obligatoire: false, valeursParDefaut:""},
          {id:"2", titre:"poids", description:"poids de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeDouble, ordre:0, obligatoire: false, valeursParDefaut:""},
          {id:"3", titre:"sexe", description:"sexe de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeString, ordre:0, obligatoire: false, valeursParDefaut:"Homme, Femme, Autre"},
          {id:"4", titre:"age", description:"age de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeDouble, ordre:0, obligatoire: false, valeursParDefaut:""},
          {id:"5", titre:"allergies", description:"allergies de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeString, ordre:0, obligatoire: false, valeursParDefaut:""},
          {id:"6", titre:"teint", description:"teint de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeString, ordre:0, obligatoire: false, valeursParDefaut:""},
          {id:"7", titre:"Groupe sangin", description:"Groupe sangin de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeString, ordre:0, obligatoire: false, valeursParDefaut:"A, A+, A-, B, B+, B-, AB, AB+, AB-, O, O+, O-"},
          {id:"8", titre:"cicatrice", description:"cicatrice de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeBoolean, ordre:0, obligatoire: false, valeursParDefaut:"true, false"},
          {id:"9", titre:"date admission", description:"date admission de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeDate, ordre:0, obligatoire: false, valeursParDefaut:""},
          {id:"10", titre:"date decharge", description:"date decharge", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeDate, ordre:0, obligatoire: false, valeursParDefaut:""},
          {id:"11", titre:"date prochain rendez-vous", description:"date prochain rendez-vous de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeDate, ordre:0, obligatoire: false, valeursParDefaut:""},
          {id:"12", titre:"aprobation du medecin", description:"aprobation du medecin", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeBoolean, ordre:0, obligatoire: false, valeursParDefaut:"true, false"},
          {id:"13", titre:"motif de la decharge", description:"motif de la decharge ", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeString, ordre:0, obligatoire: false, valeursParDefaut:""},
          {id:"14", titre:"nom", description:"nom de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeString, ordre:0, obligatoire: false, valeursParDefaut:""}
        ];
        let documents:IDocument[]=[
          {id:"1", titre:"Note intervention", description:"Document delivre par le medecin ou un infirmier de l'etablissement",
           missions:[{id:"1", libelle:"fiche de soin", description:"fiche de soin est une mission", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"),
                      service : {id:"3", libelle:"Consultation", etat:"non attribue",dateDerniereModification: new Date("12/06/1972"),dateAttribution: new Date("07/03/1990"),dateFin: new Date("07/03/1990"),nombreTotalAttributions: 50}},
                    {id:"3", libelle:"bon de commande", description:"bon de commande est une mission", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"),
                      service : {id:"1", libelle:"Pharmacie", etat:"non attribue",dateDerniereModification: new Date("07/03/2000"),dateAttribution: new Date("07/03/1990"),dateFin: new Date("07/03/1990"),nombreTotalAttributions: 6}},
                    {id:"4", libelle:"recu de paiement", description:"recu de paiement est une mission", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"),
                      service : {id:"2", libelle:"Laboratoire", etat:"non attribue",dateDerniereModification: new Date("06/08/1990"),dateAttribution: new Date("07/03/1990"),dateFin: new Date("07/03/1990"),nombreTotalAttributions: 20}}
            ],
            attributs:[{id:"1", titre:"taille", description:"taille de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: TypeTicket.Double, ordre:0, obligatoire: false, valeursParDefaut:""},
                       {id:"4", titre:"age", description:"age de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: TypeTicket.Boolean, ordre:0, obligatoire: false, valeursParDefaut:""},
                       {id:"5", titre:"allergies", description:"allergies de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: TypeTicket.String, ordre:0, obligatoire: false, valeursParDefaut:""},
                       {id:"6", titre:"teint", description:"teint de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: TypeTicket.Date, ordre:0, obligatoire: false, valeursParDefaut:""},
                       {id:"7", titre:"Groupe sangin", description:"Groupe sangin de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeString, ordre:0, obligatoire: false, valeursParDefaut:"A, A+, A-, B, B+, B-, AB, AB+, AB-, O, O+, O-"},
                       {id:"8", titre:"cicatrice", description:"cicatrice de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: TypeTicket.Tel, ordre:0, obligatoire: false, valeursParDefaut:""}
            ],
            categories:[{id:"1", nom:"informations personelles", ordre: 1,
                        listAttributs:[{id:"1", titre:"taille", description:"taille de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: TypeTicket.Double, ordre:0, obligatoire: false, valeursParDefaut:""},
                                    {id:"4", titre:"age", description:"age de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: TypeTicket.Boolean, ordre:0, obligatoire: false, valeursParDefaut:""},
                                    {id:"6", titre:"teint", description:"teint de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: TypeTicket.Date, ordre:0, obligatoire: false, valeursParDefaut:""},
                        ]},
                        {id:"2", nom:"informations de sante", ordre: 2,
                        listAttributs:[
                                    {id:"5", titre:"allergies", description:"allergies de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: TypeTicket.String, ordre:0, obligatoire: false, valeursParDefaut:""},
                                    {id:"7", titre:"Groupe sangin", description:"Groupe sangin de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: TypeTicket.Radio, ordre:0, obligatoire: false, valeursParDefaut:""},
                                    {id:"8", titre:"cicatrice", description:"cicatrice de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: TypeTicket.Tel, ordre:0, obligatoire: false, valeursParDefaut:""}
                        ]}
            ]
          },
         {id:"2", titre:"Fiche de suivi",description:"Document delivre par le medecin ou un infirmier de l'etablissement",
           missions:[{id:"1", libelle:"fiche de soin", description:"fiche de soin est une mission", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"),
                      service : {id:"3", libelle:"Consultation", etat:"non attribue",dateDerniereModification: new Date("12/06/1972"),dateAttribution: new Date("07/03/1990"),dateFin: new Date("07/03/1990"),nombreTotalAttributions: 50}},
                    {id:"3", libelle:"bon de commande", description:"bon de commande est une mission", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"),
                      service : {id:"2", libelle:"Laboratoire", etat:"non attribue",dateDerniereModification: new Date("06/08/1990"),dateAttribution: new Date("07/03/1990"),dateFin: new Date("07/03/1990"),nombreTotalAttributions: 20}},
                    {id:"2", libelle:"recu de paiement", description:"recu de paiement est une mission", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"),
                      service : {id:"2", libelle:"Laboratoire", etat:"non attribue",dateDerniereModification: new Date("06/08/1990"),dateAttribution: new Date("07/03/1990"),dateFin: new Date("07/03/1990"),nombreTotalAttributions: 20}},
            ],
           attributs:[{id:"1", titre:"taille", description:"taille de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeDouble, ordre:0, obligatoire: false, valeursParDefaut:""},
                      {id:"6", titre:"teint", description:"teint de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeString, ordre:0, obligatoire: false, valeursParDefaut:""},
                      {id:"8", titre:"cicatrice", description:"cicatrice de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeBoolean, ordre:0, obligatoire: false, valeursParDefaut:"true, false"},
                      {id:"4", titre:"age", description:"age de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeDouble, ordre:0, obligatoire: false, valeursParDefaut:""},
                      {id:"7", titre:"Groupe sangin", description:"Groupe sangin de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeString, ordre:0, obligatoire: false, valeursParDefaut:"A, A+, A-, B, B+, B-, AB, AB+, AB-, O, O+, O-"},
                      {id:"5", titre:"allergies", description:"allergies de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeString, ordre:0, obligatoire: false, valeursParDefaut:""}
            ],
            categories:[{id:"1", nom:"informations personelles", ordre: 1,
                        listAttributs:[{id:"1", titre:"taille", description:"taille de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: TypeTicket.Double, ordre:2, obligatoire: false, valeursParDefaut:""},
                                    {id:"4", titre:"age", description:"age de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: TypeTicket.Boolean, ordre:1, obligatoire: false, valeursParDefaut:""},
                                    {id:"6", titre:"teint", description:"teint de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: TypeTicket.Date, ordre:3, obligatoire: false, valeursParDefaut:""},
                        ]},
                        {id:"2", nom:"informations de sante", ordre: 2,
                        listAttributs:[
                                    {id:"5", titre:"allergies", description:"allergies de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: TypeTicket.String, ordre:2, obligatoire: false, valeursParDefaut:""},
                                    {id:"7", titre:"Groupe sangin", description:"Groupe sangin de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: TypeTicket.Radio, ordre:1, obligatoire: false, valeursParDefaut:""},
                                    {id:"8", titre:"cicatrice", description:"cicatrice de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: TypeTicket.Tel, ordre:3, obligatoire: false, valeursParDefaut:""}
                        ]}
            ]
          },
          {id:"3", titre:"Fiche de soin", description:"Document delivre par le medecin ou un infirmier de l'etablissement",
           missions:[{id:"2", libelle:"fiche de soin", description:"fiche de soin est une mission", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"),
                      service :{id:"3", libelle:"Consultation", etat:"non attribue",dateDerniereModification: new Date("12/06/1972"),dateAttribution: new Date("07/03/1990"),dateFin: new Date("07/03/1990"),nombreTotalAttributions: 50}},
                    {id:"3", libelle:"bon de commande", description:"bon de commande est une mission", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"),
                      service :{id:"3", libelle:"Consultation", etat:"non attribue",dateDerniereModification: new Date("12/06/1972"),dateAttribution: new Date("07/03/1990"),dateFin: new Date("07/03/1990"),nombreTotalAttributions: 50}},
                    {id:"4", libelle:"recu de paiement", description:"recu de paiement est une mission", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"),
                      service :{id:"3", libelle:"Consultation", etat:"non attribue",dateDerniereModification: new Date("12/06/1972"),dateAttribution: new Date("07/03/1990"),dateFin: new Date("07/03/1990"),nombreTotalAttributions: 50}}
            ],
           attributs:[{id:"1", titre:"taille",  description:"taille de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeDouble, ordre:0, obligatoire: false, valeursParDefaut:""},
                      {id:"4", titre:"age", description:"age de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeDouble, ordre:0, obligatoire: false, valeursParDefaut:""},
                      {id:"5", titre:"allergies", description:"allergies de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeString, ordre:0, obligatoire: false, valeursParDefaut:""},
                      {id:"8", titre:"cicatrice", description:"cicatrice de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeBoolean, ordre:0, obligatoire: false, valeursParDefaut:"true, false"}
            ],
             categories:[{id:"1", nom:"informations personelles", ordre: 1,
                        listAttributs:[{id:"1", titre:"taille", description:"taille de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: TypeTicket.Double, ordre:2, obligatoire: false, valeursParDefaut:""},
                                    {id:"4", titre:"age", description:"age de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: TypeTicket.Boolean, ordre:1, obligatoire: false, valeursParDefaut:""},
                        ]},
                        {id:"2", nom:"informations de sante", ordre: 2,
                        listAttributs:[
                                    {id:"5", titre:"allergies", description:"allergies de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: TypeTicket.String, ordre:1, obligatoire: false, valeursParDefaut:""},
                                    {id:"8", titre:"cicatrice", description:"cicatrice de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: TypeTicket.Tel, ordre:2, obligatoire: false, valeursParDefaut:""}
                        ]}
            ]
          },
          {id:"4", titre:"Formulaire de sortie",  description:"Document delivre par le medecin ou un infirmier de l'etablissement",
           missions:[{id:"2", libelle:"fiche de soin", description:"fiche de soin est une mission", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"),
                      service : {id:"3", libelle:"Consultation", etat:"non attribue",dateDerniereModification: new Date("12/06/1972"),dateAttribution: new Date("07/03/1990"),dateFin: new Date("07/03/1990"),nombreTotalAttributions: 50}},
                    {id:"3", libelle:"bon de commande", description:"bon de commande est une mission", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"),
                     service : {id:"1", libelle:"Pharmacie", etat:"non attribue",dateDerniereModification: new Date("07/03/2000"),dateAttribution: new Date("07/03/1990"),dateFin: new Date("07/03/1990"),nombreTotalAttributions: 6}},
                    {id:"4", libelle:"recu de paiement", description:"recu de paiement est une mission", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"),
                      service : {id:"2", libelle:"Laboratoire", etat:"non attribue",dateDerniereModification: new Date("06/08/1990"),dateAttribution: new Date("07/03/1990"),dateFin: new Date("07/03/1990"),nombreTotalAttributions: 20}}
            ],
           attributs:[{id:"14", titre:"Nom",  description:"nom de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeString, ordre:0, obligatoire: false, valeursParDefaut:""},
                      {id:"4", titre:"age", description:"age de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeDouble, ordre:0, obligatoire: false, valeursParDefaut:""},
                      {id:"5", titre:"allergies", description:"allergies de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeTextarea, ordre:0, obligatoire: false, valeursParDefaut:""},
                      {id:"1", titre:"taille", description:"taille de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeDouble, ordre:0, obligatoire: false, valeursParDefaut:""},
                      {id:"7", titre:"Groupe sangin", description:"Groupe sangin de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeString, ordre:0, obligatoire: false, valeursParDefaut:"A, A+, A-, B, B+, B-, AB, AB+, AB-, O, O+, O-"},
                      {id:"8", titre:"cicatrice", description:"cicatrice de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeBoolean, ordre:0, obligatoire: false, valeursParDefaut:"true, false"},
                      {id:"9", titre:"date admission", description:"date admission de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeDate, ordre:0, obligatoire: false, valeursParDefaut:""},
                      {id:"10", titre:"date decharge", description:"date decharge", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeDate, ordre:0, obligatoire: false, valeursParDefaut:""},
                      {id:"11", titre:"date prochain rendez-vous", description:"date prochain rendez-vous de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeDate, ordre:0, obligatoire: false, valeursParDefaut:""},
                      {id:"12", titre:"aprobation du medecin", description:"aprobation du medecin", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeBoolean, ordre:0, obligatoire: false, valeursParDefaut:"true, false"},
                      {id:"13", titre:"motif de la decharge", description:"motif de la decharge ", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeString, ordre:0, obligatoire: false, valeursParDefaut:""}
            ],
            categories:[{id:"1", nom:"informations personelles", ordre: 1,
                        listAttributs:[
                                    {id:"14", titre:"Nom", description:"nom de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeString, ordre:1, obligatoire: false, valeursParDefaut:""},
                                    {id:"1", titre:"taille", description:"taille de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: TypeTicket.Double, ordre:2, obligatoire: false, valeursParDefaut:""},
                                    {id:"4", titre:"age", description:"age de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: TypeTicket.Boolean, ordre:3, obligatoire: false, valeursParDefaut:""},
                        ]},
                        {id:"2", nom:"informations de sante", ordre: 3,
                        listAttributs:[
                                    {id:"5", titre:"allergies", description:"allergies de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: TypeTicket.String, ordre:2, obligatoire: false, valeursParDefaut:""},
                                    {id:"7", titre:"Groupe sangin", description:"Groupe sangin de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: TypeTicket.Radio, ordre:1, obligatoire: false, valeursParDefaut:""},
                                    {id:"8", titre:"cicatrice", description:"cicatrice de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: TypeTicket.Tel, ordre:3, obligatoire: false, valeursParDefaut:""}
                        ]},
                        {id:"3", nom:"informations de suivi medical", ordre: 2,
                        listAttributs:[
                          {id:"9", titre:"date admission", description:"date admission de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeDate, ordre:1, obligatoire: false, valeursParDefaut:""},
                          {id:"10", titre:"date decharge", description:"date decharge", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeDate, ordre:2, obligatoire: false, valeursParDefaut:""},
                          {id:"11", titre:"date prochain rendez-vous", description:"date prochain rendez-vous de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeDate, ordre:3, obligatoire: false, valeursParDefaut:""},
                          {id:"12", titre:"aprobation du medecin", description:"aprobation du medecin", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeBoolean, ordre: 4, obligatoire: false, valeursParDefaut:"true, false"},
                          {id:"13", titre:"motif de la decharge", description:"motif de la decharge ", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeString, ordre:5, obligatoire: false, valeursParDefaut:""}
                        ]}
            ]
          },
          {id:"5", titre:"ordonnance", description:"Document delivre par le medecin ou un infirmier de l'etablissement",
           missions:[{id:"1", libelle:"fiche de soin", description:"fiche de soin est une mission", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"),
                      service : {id:"3", libelle:"Consultation", etat:"non attribue",dateDerniereModification: new Date("12/06/1972"),dateAttribution: new Date("07/03/1990"),dateFin: new Date("07/03/1990"),nombreTotalAttributions: 50}},
                    {id:"2", libelle:"bon de commande", description:"bon de commande est une mission", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"),
                      service : {id:"2", libelle:"Laboratoire", etat:"non attribue",dateDerniereModification: new Date("06/08/1990"),dateAttribution: new Date("07/03/1990"),dateFin: new Date("07/03/1990"),nombreTotalAttributions: 20}},
                    {id:"5", libelle:"recu de paiement", description:"recu de paiement est une mission", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"),
                      service : {id:"2", libelle:"Laboratoire", etat:"non attribue",dateDerniereModification: new Date("06/08/1990"),dateAttribution: new Date("07/03/1990"),dateFin: new Date("07/03/1990"),nombreTotalAttributions: 20}},
            ],
           attributs:[{id:"1", titre:"taille", description:"taille de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeDouble , ordre: 0, obligatoire: false, valeursParDefaut:""},
                      {id:"6", titre:"teint", description:"teint de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeString , ordre: 0, obligatoire: false, valeursParDefaut:""},
                      {id:"8", titre:"cicatrice", description:"cicatrice de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeBoolean , ordre: 0, obligatoire: false, valeursParDefaut:""},
                      {id:"4", titre:"age", description:"age de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeDouble , ordre: 0, obligatoire: false, valeursParDefaut:""},
                      {id:"7", titre:"Groupe sangin", description:"Groupe sangin de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeString, ordre:0, obligatoire: false, valeursParDefaut:"A, A+, A-, B, B+, B-, AB, AB+, AB-, O, O+, O-"},
                      {id:"5", titre:"allergies", description:"allergies de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeString , ordre: 0, obligatoire: false, valeursParDefaut:""}
            ],
            categories:[{id:"1", nom:"informations personelles", ordre: 1,
                        listAttributs:[{id:"1", titre:"taille",  description:"taille de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: TypeTicket.Double , ordre: 2, obligatoire: false, valeursParDefaut:""},
                                    {id:"4", titre:"age", description:"age de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: TypeTicket.Boolean , ordre: 1, obligatoire: false, valeursParDefaut:""},
                                    {id:"6", titre:"teint", description:"teint de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: TypeTicket.Date , ordre: 3, obligatoire: false, valeursParDefaut:""},
                        ]},
                        {id:"2", nom:"informations de sante", ordre: 2,
                        listAttributs:[
                                    {id:"5", titre:"allergies", description:"allergies de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: TypeTicket.String , ordre: 2, obligatoire: false, valeursParDefaut:""},
                                    {id:"7", titre:"Groupe sangin", description:"Groupe sangin de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeString, ordre:0, obligatoire: false, valeursParDefaut:"A, A+, A-, B, B+, B-, AB, AB+, AB-, O, O+, O-"},
                                    {id:"8", titre:"cicatrice", description:"cicatrice de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: TypeTicket.Tel , ordre: 3, obligatoire: false, valeursParDefaut:""}
                        ]}
            ]
          }
        ];
        let exemplaires:IExemplaireDocument[]=[
          {id:"1", idDocument:"4", titre:"Formulaire de sortie", description:"Document delivre par le medecin ou un infirmier de l'etablissement",
            missions:[{id:"2", libelle:"fiche de soin", description:"fiche de soin est une mission", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"),
                        service : {id:"3", libelle:"Consultation", etat:"non attribue",dateDerniereModification: new Date("12/06/1972"),dateAttribution: new Date("07/03/1990"),dateFin: new Date("07/03/1990"),nombreTotalAttributions: 50}},
                      {id:"3", libelle:"bon de commande", description:"bon de commande est une mission", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"),
                        service : {id:"1", libelle:"Pharmacie", etat:"non attribue",dateDerniereModification: new Date("07/03/2000"),dateAttribution: new Date("07/03/1990"),dateFin: new Date("07/03/1990"),nombreTotalAttributions: 6}},
                      {id:"4", libelle:"recu de paiement", description:"recu de paiement est une mission", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"),
                        service : {id:"2", libelle:"Laboratoire", etat:"non attribue",dateDerniereModification: new Date("06/08/1990"),dateAttribution: new Date("07/03/1990"),dateFin: new Date("07/03/1990"),nombreTotalAttributions: 20}}
              ],
            attributs:[{id:"14", titre:"Nom", description:"nom de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeString , ordre: 0, obligatoire: false, valeursParDefaut:""},
                        {id:"4", titre:"age", description:"age de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeDouble , ordre: 0, obligatoire: false, valeursParDefaut:""},
                        {id:"5", titre:"allergies", description:"allergies de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeTextarea , ordre: 0, obligatoire: false, valeursParDefaut:""},
                        {id:"1", titre:"taille", description:"taille de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeDouble , ordre: 0, obligatoire: false, valeursParDefaut:""},
                        {id:"7", titre:"Groupe sangin", description:"Groupe sangin de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeString, ordre:0, obligatoire: false, valeursParDefaut:"A, A+, A-, B, B+, B-, AB, AB+, AB-, O, O+, O-"},
                        {id:"8", titre:"cicatrice", description:"cicatrice de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeBoolean , ordre: 0, obligatoire: false, valeursParDefaut:""},
                        {id:"9", titre:"date admission", description:"date admission de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeDate , ordre: 0, obligatoire: false, valeursParDefaut:""},
                        {id:"10", titre:"date decharge", description:"date decharge", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeDate , ordre: 0, obligatoire: false, valeursParDefaut:""},
                        {id:"11", titre:"date prochain rendez-vous", description:"date prochain rendez-vous de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeDate , ordre: 0, obligatoire: false, valeursParDefaut:""},
                        {id:"12", titre:"aprobation du medecin", description:"aprobation du medecin", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeBoolean , ordre: 0, obligatoire: false, valeursParDefaut:""},
                        {id:"13", titre:"motif de la decharge", description:"motif de la decharge ", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeString , ordre: 0, obligatoire: false, valeursParDefaut:""}
              ],
              categories:[{id:"1", nom:"informations personelles", ordre: 1,
                          listAttributs:[
                                      {id:"14", titre:"Nom", description:"nom de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeString , ordre: 1, obligatoire: false, valeursParDefaut:""},
                                      {id:"1", titre:"taille", description:"taille de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: TypeTicket.Double , ordre: 2, obligatoire: false, valeursParDefaut:""},
                                      {id:"4", titre:"age", description:"age de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: TypeTicket.Boolean , ordre: 3, obligatoire: false, valeursParDefaut:""},
                          ]},
                          {id:"2", nom:"informations de sante", ordre: 3,
                          listAttributs:[
                                      {id:"5", titre:"allergies", description:"allergies de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: TypeTicket.String , ordre: 2, obligatoire: false, valeursParDefaut:""},
                                      {id:"7", titre:"Groupe sangin", description:"Groupe sangin de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeString, ordre:0, obligatoire: false, valeursParDefaut:"A, A+, A-, B, B+, B-, AB, AB+, AB-, O, O+, O-"},
                                      {id:"8", titre:"cicatrice", description:"cicatrice de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: TypeTicket.Tel , ordre: 3, obligatoire: false, valeursParDefaut:""}
                          ]},
                          {id:"3", nom:"informations de suivi medical", ordre: 2,
                          listAttributs:[
                                      {id:"9", titre:"date admission", description:"date admission de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeDate , ordre: 1, obligatoire: false, valeursParDefaut:""},
                                      {id:"10", titre:"date decharge", description:"date decharge", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeDate , ordre: 2, obligatoire: false, valeursParDefaut:""},
                                      {id:"11", titre:"date prochain rendez-vous", description:"date prochain rendez-vous de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeDate , ordre: 3, obligatoire: false, valeursParDefaut:""},
                                      {id:"12", titre:"aprobation du medecin", description:"aprobation du medecin", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeBoolean , ordre: 4, obligatoire: false, valeursParDefaut:""},
                                      {id:"13", titre:"motif de la decharge", description:"motif de la decharge ", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeString , ordre: 5, obligatoire: false, valeursParDefaut:""}
                  ]}
              ],
              objetEnregistre:[
                {key:"4", value:"23"},
                {key:"5", value:"oignon, lait, mangue"},
                {key:"1", value:"1.78"},
                {key:"7", value:"A+"},
                {key:"8", value:"non"},
                {key:"9", value:  new Date("07/03/2023")},
                {key:"10", value:  new Date("17/03/2023")},
                {key:"11", value:  new Date("17/06/2023")},
                {key:"12", value:"oui"},
                {key:"13", value:"Fin traitement"}
              ]
          },
          {id:"2", idDocument:"5", titre:"ordonnance", description:"Document delivre par le medecin ou un infirmier de l'etablissement",
              missions:[{id:"1", libelle:"fiche de soin", description:"fiche de soin est une mission", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"),
                        service : {id:"3", libelle:"Consultation", etat:"non attribue",dateDerniereModification: new Date("12/06/1972"),dateAttribution: new Date("07/03/1990"),dateFin: new Date("07/03/1990"),nombreTotalAttributions: 50}},
                      {id:"2", libelle:"bon de commande", description:"bon de commande est une mission", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"),
                        service : {id:"2", libelle:"Laboratoire", etat:"non attribue",dateDerniereModification: new Date("06/08/1990"),dateAttribution: new Date("07/03/1990"),dateFin: new Date("07/03/1990"),nombreTotalAttributions: 20}},
                      {id:"5", libelle:"recu de paiement", description:"recu de paiement est une mission", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"),
                        service : {id:"2", libelle:"Laboratoire", etat:"non attribue",dateDerniereModification: new Date("06/08/1990"),dateAttribution: new Date("07/03/1990"),dateFin: new Date("07/03/1990"),nombreTotalAttributions: 20}},
              ],
              attributs:[{id:"1", titre:"taille", description:"taille de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeDouble , ordre: 0, obligatoire: false, valeursParDefaut:""},
                        {id:"6", titre:"teint", description:"teint de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeString , ordre: 0, obligatoire: false, valeursParDefaut:""},
                        {id:"8", titre:"cicatrice", description:"cicatrice de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeBoolean , ordre: 0, obligatoire: false, valeursParDefaut:""},
                        {id:"4", titre:"age", description:"age de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeDouble , ordre: 0, obligatoire: false, valeursParDefaut:""},
                        {id:"7", titre:"Groupe sangin", description:"Groupe sangin de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeString, ordre:0, obligatoire: false, valeursParDefaut:"A, A+, A-, B, B+, B-, AB, AB+, AB-, O, O+, O-"},
                        {id:"5", titre:"allergies", description:"allergies de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeString , ordre: 0, obligatoire: false, valeursParDefaut:""}
              ],
              categories:[{id:"1", nom:"informations personelles", ordre: 1,
                          listAttributs:[{id:"1", titre:"taille", description:"taille de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: TypeTicket.Double , ordre: 1, obligatoire: false, valeursParDefaut:""},
                                      {id:"4", titre:"age", description:"age de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: TypeTicket.Boolean , ordre: 2, obligatoire: false, valeursParDefaut:""},
                                      {id:"6", titre:"teint", description:"teint de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: TypeTicket.Date , ordre: 3, obligatoire: false, valeursParDefaut:""},
                          ]},
                          {id:"2", nom:"informations de sante", ordre: 2,
                          listAttributs:[
                                      {id:"5", titre:"allergies", description:"allergies de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: TypeTicket.String , ordre: 2, obligatoire: false, valeursParDefaut:""},
                                      {id:"7", titre:"Groupe sangin", description:"Groupe sangin de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: this.typeString, ordre:0, obligatoire: false, valeursParDefaut:"A, A+, A-, B, B+, B-, AB, AB+, AB-, O, O+, O-"},
                                      {id:"8", titre:"cicatrice", description:"cicatrice de l'individu", etat: true, dateCreation:  new Date("07/03/2000"), dateModification:  new Date("07/03/1990"), type: TypeTicket.Tel , ordre: 3, obligatoire: false, valeursParDefaut:""}
                          ]}
              ],
              objetEnregistre:[
                {key:"1", value:"1.70"},
                {key:"6", value:"noir"},
                {key:"8", value:"oui"},
                {key:"4", value:"23"},
                {key:"7", value:"A+"},
                {key:"5", value:"oignon, lait, mangue"}
              ]
          }
        ];
        let famille:IFamille[]=[
          {id:"1", libelle:"trans", description:"sang", etat:"gl"},
          {id:"2", libelle:"néonat", description:"nouveau-né", etat:"malade"},
          {id:"3", libelle:"pediatrie", description:"enfant", etat:"souffrant"},
          {id:"4", libelle:"néonat", description:"nouveau-né", etat:"malade"},
          {id:"5", libelle:"transfusion", description:"sang", etat:"gl"},
      ];
      let ressource:IRessource[]=[
        {id:"1", libelle:"transfusion",etat:true, /*dateCreation:new Date("07/03/2000"),dateModification:new Date("07/03/1990"),*/quantite:10,unite:this.UnitesLitre,prix:1000,caracteristique:"souple",
          famille:{id:"1", libelle:"trans", description:"sang", etat:"gl"}},
        {id:"2", libelle:"néonat",etat: true,/* dateCreation:new Date("07/03/2000"),dateModification:new Date("07/03/1990"),*/quantite:20,unite:this.UnitesLitre,prix:2000,caracteristique:"souple",
          famille: {id:"2", libelle:"néonat", description:"nouveau-né", etat:"malade"}},
        {id:"2", libelle:"néonat",etat: true,/* dateCreation:new Date("07/03/2000"),dateModification:new Date("07/03/1990"),*/quantite:20,unite:this.UnitesLitre,prix:2000,caracteristique:"souple",
          famille:{id:"3", libelle:"pediatrie", description:"enfant", etat:"souffrant"}},
        {id:"3", libelle:"pediatrie",etat: true, /*dateCreation:new Date("07/03/2000"),dateModification:new Date("07/03/1990"),*/quantite:30,unite:this.UnitesLitre,prix:3000,caracteristique:"souple",
          famille:{id:"4", libelle:"néonat", description:"nouveau-né", etat:"malade"}},
        {id:"4", libelle:"néonat",etat: true,/*dateCreation:new Date("07/03/2000"),dateModification:new Date("07/03/1990"),*/quantite:40,unite:this.UnitesLitre,prix:4000,caracteristique:"souple",
          famille:{id:"5", libelle:"transfusion", description:"sang", etat:"gl"}},
      ];

      let precomvt:IPrecoMvt[]=[
                {id:"1",libelle:"rachat",etat: true,type:'neutre',/*type:this.TypeMvtNeutre*/
                  precomvtqte:[{id:"1",quantiteMin:10,  quantiteMax:20,  montantMin:1000, montantMax:7000,/*fournisseur:'gc',*/
                              ressource:{id:"1", libelle:"transfusion",etat:true,quantite:10,unite:this.UnitesLitre,prix:1000,caracteristique:"souple", famille:{id:"4", libelle:"néonat", description:"nouveau-né", etat:"malade"}}
                          }]},
                {id:"2",libelle:"vente",etat: true,type:'reduire',/*type:this.TypeMvtReduire*/
                precomvtqte:[{id:"1",quantiteMin:30,  quantiteMax:40,  montantMin:100, montantMax:7000,/*fournisseur:'gc',*/
                            famille:[
                                    {id:"1", libelle:"trans", description:"sang", etat:"gl"},
                                    {id:"2", libelle:"néonat", description:"nouveau-né", etat:"malade"},
                                    {id:"3", libelle:"pediatrie", description:"enfant", etat:"souffrant"}
                                  ]
                        }]},
                {id:"3",libelle:"vente",etat: true,type:'reduire',/*type:this.TypeMvtReduire*/
                precomvtqte:[{id:"1",quantiteMin:30,  quantiteMax:40,  montantMin:100, montantMax:7000,/*fournisseur:'gc',*/
                       distributeur:[
                                   {id:"1", raisonSocial:"brasserie", adresse:"Dla", telephone:"655554488", mail: "ngong@yad.fr"},
                                   {id:"2", raisonSocial:"guinness",adresse:"Ydé", telephone: "655554481", mail: "ngong@yad.fr"},
                                   {id:"3", raisonSocial:"papeterie yvan", adresse:"Buéa", telephone:"655554486", mail:"ngong@yad.fr"}
                                  ]
                        }]},
            ];
      let distributeur:IDistributeur[]=[
        {id:"1", raisonSocial:"cgb", adresse:"Dla", telephone:"655554488", mail: "ngong@yad.fr"},
        {id:"2", raisonSocial:"bgb",adresse:"Ydé", telephone: "655554481", mail: "ngong@yad.fr"},
        {id:"3", raisonSocial:"cvc", adresse:"Buéa", telephone:"655554486", mail:"ngong@yad.fr"},
      ];
        return{patients, services, menus, tickets, missions, attributs, documents,exemplaires,famille,ressource,precomvt,distributeur};
  }
}
