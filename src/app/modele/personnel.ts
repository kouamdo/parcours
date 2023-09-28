export interface IPersonnel
{
    id:string,
    nom:string,
    prenom:string,
    sexe:string,
    dateNaissance:Date,
    email:string,
    telephone:string,
    dateEntree?:Date,
    dateSortie?:Date
}