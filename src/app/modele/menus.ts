import { IFonctionnalites } from "./fonctionnalites";

export interface IMenus {
    idUser : string,
    langue: string,
    fonctionnalites: IFonctionnalites[]
}