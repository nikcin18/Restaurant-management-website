import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-radno-vreme',
  templateUrl: './admin-radno-vreme.component.html',
  styleUrls: ['./admin-radno-vreme.component.css'],
})
export class AdminRadnoVremeComponent implements OnInit {
  constructor() {}

  intervali: string[][][] = <string[][][]>[];
  dani: string[] = [
    'Ponedeljak',
    'Utorak',
    'Sreda',
    'Cetvrtak',
    'Petak',
    'Subota',
    'Nedelja',
  ];
  izabrano: boolean[] = [];
  brojTekst: string[] = [];
  brojIntervala: number[] = [];
  najduziDan: number = 0;
  max: number = 10;
  ngOnInit(): void {
    for (let i = 0; i < 7; i++) {
      this.izabrano.push(false);
      this.brojIntervala.push(0);
      this.brojTekst.push('0');
      (<string[][][]>this.intervali).push(<string[][]>[]);
      for (let j = 0; j < this.max; j++) {
        (<string[][]>this.intervali[i]).push(<string[]>[]);
        this.intervali[i][j].push('');
        this.intervali[i][j].push('');
      }
    }
    this.najduziDan = 0;
  }

  dohvatiRadnoVreme() {
    let rezultat = <number[][][]>[];
    for (let i = 0; i < 7; i++) {
      let dan = <number[][]>[];
      for (let j = 0; j < this.brojIntervala[i]; j++) {
        let p1 = Number.parseInt(this.intervali[i][j][0].substring(0, 2));
        let p2 = Number.parseInt(this.intervali[i][j][0].substring(3, 5));
        let pocetak = p1 * 60 + p2;
        let k1 = Number.parseInt(this.intervali[i][j][1].substring(0, 2));
        let k2 = Number.parseInt(this.intervali[i][j][1].substring(3, 5));
        let kraj = k1 * 60 + k2;
        if (kraj == 0) kraj = 24 * 60;
        dan.push([pocetak, kraj]);
      }
      rezultat.push(dan);
    }
    return rezultat;
  }

  praznoRadnoVreme() {
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < this.brojIntervala[i]; j++) {
        if (
          this.intervali[i][j][0] == '' ||
          this.intervali[i][j][0] == undefined
        )
          return true;
        if (
          this.intervali[i][j][1] == '' ||
          this.intervali[i][j][1] == undefined
        )
          return true;
      }
    }
    return false;
  }

  loseRadnoVreme() {
    for (let i = 0; i < 7; i++) {
      let poslednjiInterval = '';
      for (let j = 0; j < this.brojIntervala[i]; j++) {
        if (
          poslednjiInterval.length > 0 &&
          !(poslednjiInterval < this.intervali[i][j][0])
        )
          return true;
        if (
          !(this.intervali[i][j][0] < this.intervali[i][j][1]) &&
          this.intervali[i][j][1] !== '00:00'
        ) {
          return true;
        }
        if (this.intervali[i][j][1] !== '00:00')
          poslednjiInterval = this.intervali[i][j][1];
        else poslednjiInterval = '24:00';
      }
    }
    return false;
  }

  azurirajIzabrano(dan: number) {
    this.izabrano[dan] = !this.izabrano[dan];
    if (!this.izabrano[dan]) {
      this.brojIntervala[dan] = 0;
      this.brojTekst[dan] = '0';
    } else {
      this.brojIntervala[dan] = 1;
      this.brojTekst[dan] = '1';
    }
    this.dohvatiNajduziDan();
  }

  azurirajBrojIntervala(dan: number) {
    if (!new RegExp(/^[ ]*[1-9][0-9]?[ ]*$/).test(this.brojTekst[dan])) {
      this.brojTekst[dan] = this.brojIntervala[dan].toString();
      return;
    }
    let broj = Number.parseInt(this.brojTekst[dan]);
    if (broj < 1 || broj > this.max) {
      this.brojTekst[dan] = this.brojIntervala[dan].toString();
      return;
    }
    this.brojIntervala[dan] = broj;
    this.brojTekst[dan] = this.brojIntervala[dan].toString();
    this.dohvatiNajduziDan();
  }

  range(a: number, b: number) {
    let arr = <number[]>[];
    for (let i = a; i < b; i++) arr.push(i);
    return arr;
  }

  dohvatiNajduziDan(): void {
    this.najduziDan = this.brojIntervala[0];
    for (let i = 1; i < 7; i++)
      if (this.brojIntervala[i] > this.najduziDan)
        this.najduziDan = this.brojIntervala[i];
  }
}
