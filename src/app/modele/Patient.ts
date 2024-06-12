export interface IPatient {
  id: string;
  nom: string;
  prenom?: string;
  sexe?: string;
  dateNaissance?: Date;
  adresse: string;
  mail: string;
  mdp: string;
  telephone: string;
  qrCodeValue: string;
  personnesRatachees?: IPatient[];
}
