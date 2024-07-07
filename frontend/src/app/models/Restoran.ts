import { Ocena } from './Ocena';
import { Raspored } from './Raspored';

export class Restoran {
  id: number = 0;
  naziv: string = '';
  tip: string = '';
  adresa: string = '';
  opis: string = '';
  kontakt: string = '';
  ocene: Ocena[] = [];
  zaposleni: string[] = [];
  raspored: Raspored = new Raspored();
  radno_vreme: number[][][] = [];
}
