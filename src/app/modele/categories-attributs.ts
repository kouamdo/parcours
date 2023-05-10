import { IAttributs } from "./attributs";

export interface ICategoriesAttributs {
    id:string,
    nom:string,
    ordre : number,
    listAttributs : IAttributs[]
}
