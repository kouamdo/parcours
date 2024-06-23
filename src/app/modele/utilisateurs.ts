import { IGroupes } from "./groupes";
import { IMenu } from "./menu";
import { IPersonnel } from "./personnel";

export interface IUtilisateurs {
    id: string,
    login: string,
    passWord: string,
    menu?: IMenu,
    groupe?: IGroupes,
    user: IPersonnel
}