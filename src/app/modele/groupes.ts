import { IMenus } from "./menus";

export interface IGroupes {
    id: string;
    etat: string,
    libelle: string,
    menu: IMenus[]
}