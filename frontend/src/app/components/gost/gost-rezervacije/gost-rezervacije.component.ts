import { Component, OnInit } from '@angular/core';
import { Gost } from 'src/app/models/Gost';
import { Rezervacija } from 'src/app/models/Rezervacija';
import { RezervacijaService } from 'src/app/services/rezervacija.service';

@Component({
  selector: 'app-gost-rezervacije',
  templateUrl: './gost-rezervacije.component.html',
  styleUrls: ['./gost-rezervacije.component.css'],
})
export class GostRezervacijeComponent implements OnInit {
  constructor(private rezService: RezervacijaService) {}

  gost: Gost = new Gost();
  aktuelneRezervacije: Rezervacija[] = [];
  istekleRezervacije: Rezervacija[] = [];
  neobradjeneRezervacije: Rezervacija[] = [];
  neuspesneRezervacije: Rezervacija[] = [];

  otkaziGreska: string = '';
  otvorenaForma: boolean = false;
  komentar: string = '';
  ocena: number = 0;
  izabranaRezervacija: Rezervacija = new Rezervacija();
  formaGreska: string = '';
  slike: number[] = [];

  ngOnInit(): void {
    let ss_gost = sessionStorage.getItem('gost');
    if (ss_gost) this.gost = JSON.parse(ss_gost);
    this.dohvatiRezervacije();
  }

  dohvatiRezervacije(): void {
    this.istekleRezervacije = [];
    this.aktuelneRezervacije = [];
    this.neuspesneRezervacije = [];
    this.rezService
      .dohvatiRezervacijeGost(this.gost.kor_ime)
      .subscribe((data) => {
        this.aktuelneRezervacije = [];
        this.istekleRezervacije = [];
        if (data) {
          data = data.sort((rez1, rez2) => {
            return (
              (rez1.dan_posete - rez2.dan_posete) * 24 * 60 +
              rez1.pocetak -
              rez2.pocetak
            );
          });
          let sada = Date.now();
          let brojMinuta =
            Math.floor(sada / (60 * 1000)) - new Date().getTimezoneOffset();
          for (let r of data) {
            if (r.status == 'neobradjena') {
              this.neobradjeneRezervacije.push(r);
            } else if (
              r.status == 'odbijena' ||
              r.status == 'otkazana' ||
              r.status == 'propustena'
            ) {
              this.neuspesneRezervacije.push(r);
            } else if (r.dan_posete * 24 * 60 + r.pocetak <= brojMinuta) {
              this.istekleRezervacije.push(r);
            } else {
              this.aktuelneRezervacije.push(r);
            }
          }
        }
        this.istekleRezervacije = this.istekleRezervacije.sort(function (
          r1,
          r2
        ) {
          return r2.datum_prijave - r1.datum_prijave;
        });
        this.aktuelneRezervacije = this.aktuelneRezervacije.sort(function (
          r1,
          r2
        ) {
          return r2.pocetak - r1.pocetak;
        });
      });
  }

  prosiriString(str: string, n: number, c: string) {
    let rezultat = str;
    while (rezultat.length < n) rezultat = c + rezultat;
    return rezultat;
  }

  odrediDatum(dan: number, pocetak: number) {
    let datum = new Date(dan * 24 * 60 * 60 * 1000);
    let g = this.prosiriString(datum.getFullYear().toString(), 4, '0');
    let m = this.prosiriString((datum.getMonth() + 1).toString(), 2, '0');
    let d = this.prosiriString(datum.getDate().toString(), 2, '0');
    let hh = this.prosiriString(Math.floor(pocetak / 60).toString(), 2, '0');
    let mm = this.prosiriString((pocetak % 60).toString(), 2, '0');
    return g + '-' + m + '-' + d + ' ' + hh + ':' + mm;
  }

  mozeOtkazati(rezervacija: Rezervacija) {
    let sada = Date.now();
    let sadaMinuti =
      Math.floor(sada / (60 * 1000)) - new Date().getTimezoneOffset();
    let pocetakMinuti = rezervacija.dan_posete * 24 * 60 + rezervacija.pocetak;
    if (rezervacija.status == 'u toku' && sadaMinuti <= pocetakMinuti - 45)
      return true;
    else return false;
  }

  otvoriFormu(rezervacija: Rezervacija): void {
    this.oceni(0);
    this.komentar = '';
    this.otvorenaForma = true;
    this.izabranaRezervacija = rezervacija;
    this.formaGreska = '';
    this.otkaziGreska = '';
  }

  zatvoriFormu(): void {
    this.otvorenaForma = false;
    this.izabranaRezervacija = new Rezervacija();
  }

  oceni(novaOcena: number) {
    this.ocena = novaOcena;
    this.slike = [];
    while (novaOcena >= 0.75) {
      this.slike.push(2);
      novaOcena--;
    }
    while (this.slike.length < 5) this.slike.push(0);
  }

  posaljiOcenu(): void {
    this.formaGreska = '';
    this.otkaziGreska = '';
    if (this.ocena == 0) {
      this.formaGreska = 'Niste dali ocenu (kliknite na neku od zvezdica)';
      return;
    }
    this.rezService
      .oceniRezervaciju(this.izabranaRezervacija.id, this.komentar, this.ocena)
      .subscribe((data) => {
        if (data.poruka == 'ok') {
          this.otvorenaForma = false;
          this.dohvatiRezervacije();
        } else {
          this.formaGreska = data.poruka;
        }
        this.izabranaRezervacija = new Rezervacija();
      });
  }

  otkaziRezervaciju(id: number) {
    this.formaGreska = '';
    this.otkaziGreska = '';
    let sada = Date.now();
    let sadaMinuti =
      Math.floor(sada / (60 * 1000)) - new Date().getTimezoneOffset();

    this.rezService.otkaziRezervaciju(id, sadaMinuti).subscribe((data) => {
      if (data.poruka == 'ok') {
        this.dohvatiRezervacije();
      } else {
        this.otkaziGreska = data.poruka;
      }
    });
  }

  range(a: number, b: number) {
    let arr = <number[]>[];
    for (let i = a; i < b; i++) arr.push(i);
    return arr;
  }

  datumMojFormat(ms: number) {
    let datum = new Date(ms);
    let godine = ('0000' + datum.getFullYear().toString()).slice(-4);
    let meseci = ('00' + (datum.getMonth() + 1).toString()).slice(-2);
    let dani = ('00' + datum.getDate().toString()).slice(-2);
    let sati = ('00' + datum.getHours().toString()).slice(-2);
    let minuti = ('00' + datum.getMinutes().toString()).slice(-2);
    return godine + '-' + meseci + '-' + dani + ' ' + sati + ':' + minuti;
  }

  getTimezoneOffset() {
    return new Date().getTimezoneOffset();
  }
}
