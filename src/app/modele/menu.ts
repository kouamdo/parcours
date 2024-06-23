import { IFonctionnalites } from "./fonctionnalites";
import { IPersonnel } from "./personnel";

export interface IMenu {
    user? : IPersonnel,
    langue: string,
    fonctionnalites: IFonctionnalites[]
}