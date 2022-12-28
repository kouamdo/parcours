export interface IPatient
{
    id:number,
    nom:string,
    prenom?:string,
    sexe?:string,
    dateNaissance?:Date,
    adresse:string,
    mail:string,
    telephone:string,
}