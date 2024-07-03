import { IGroupes } from './groupes';
import { IRole } from './role';

export interface IPersonnel {
  [x: string]: any;
  id: string;
  nom: string;
  prenom: string;
  sexe: string;
  dateNaissance: Date;
  email: string;
  telephone: string;
  dateEntree?: Date;
  dateSortie?: Date;
  roles?: [
    {
      role: IRole;
      status: boolean;
      dateDebut: Date;
      dateFin?: Date;
    }
  ];
  qrCodeValue: string;
}
