import { IEtats } from './etats';
import { IValidation } from './validation';
import { IEtape } from './etape';

export interface IDocEtats {
  id: string;
  etat: IEtats;
  ordre: number;
  dateCreation: Date;
  validation?: IValidation;
  etape?: IEtape;
  checked?: boolean;
}
