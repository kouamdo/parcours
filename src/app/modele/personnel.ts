import { IRole } from './role';

export interface IPersonnel {
  id: string;
  nom: string;
  prenom: string;
  sexe: string;
  dateNaissance: Date;
  mdp: string;
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
