export interface IPatient {
  id: string;
  nom: string;
  prenom?: string;
  sexe?: string;
  dateNaissance?: Date;
  adresse: string;
  mail: string;
  telephone: string;
  qrCodeValue: string;
  personnesRatachees?: IPersonneRattachee[];
}

export interface IPersonneRattachee {
  id?: string;
  nom?: string;
  prenom?: string;
  sexe?: string;
  dateNaissance?: Date;
}
