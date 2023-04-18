import { IAttributs } from "./attributs";

export interface ICategoriesAttributs {
    id:string,
    ordre : number
    nom:string,
    listAttributs : IAttributs[]
}
