import { Component, OnInit } from '@angular/core';
import { Restoran } from 'src/app/models/Restoran';
import { GostService } from 'src/app/services/gost.service';
import { RestoranService } from 'src/app/services/restoran.service';
import { RezervacijaService } from 'src/app/services/rezervacija.service';

@Component({
  selector: 'app-nereg-pocetna',
  templateUrl: './nereg-pocetna.component.html',
  styleUrls: ['./nereg-pocetna.component.css'],
})
export class NeregPocetnaComponent implements OnInit {
  constructor(
    private gService: GostService,
    private restService: RestoranService,
    private rezService: RezervacijaService
  ) {}

  rezervacije: number[] = [];
  brojGostiju: number = 0;
  restorani: Restoran[] = [];
  pretragaNaziv: string = '';
  pretragaTip: string = '';
  pretragaAdresa: string = '';

  ngOnInit(): void {
    sessionStorage.clear();

    this.gService.dohvatiBrojGostiju().subscribe((data) => {
      if (data != null) {
        this.brojGostiju = data;
      }
    });
    this.restService.dohvatiSveRestorane().subscribe((data) => {
      if (data != null) {
        this.restorani = data;
        this.restorani.sort(function (r1, r2) {
          if (r1.naziv < r2.naziv) return -1;
          if (r1.naziv == r2.naziv) return 0;
          return 1;
        });
        for (let r of this.restorani) {
          r.zaposleni.sort((s1, s2) => {
            return s1.localeCompare(s2);
          });
        }
      }
    });
    this.rezService.dohvatiStatistikuPocetna(Date.now()).subscribe((data) => {
      if (data != null) {
        this.rezervacije = data;
      }
    });
  }

  pretragaRestorana(): void {
    this.restService
      .pretragaRestorana(
        this.pretragaNaziv,
        this.pretragaTip,
        this.pretragaAdresa
      )
      .subscribe((data) => {
        if (data != null) {
          this.restorani = data;
          this.restorani.sort(function (r1, r2) {
            return r1.naziv.localeCompare(r2.naziv);
          });
        }
      });
  }

  sortirajNazivO(): void {
    this.restorani.sort(function (r1, r2) {
      return r2.naziv.localeCompare(r1.naziv);
    });
  }

  sortirajNazivR(): void {
    this.restorani.sort(function (r1, r2) {
      return r1.naziv.localeCompare(r2.naziv);
    });
  }

  sortirajAdresaO(): void {
    this.restorani.sort(function (r1, r2) {
      return r2.adresa.localeCompare(r1.adresa);
    });
  }

  sortirajAdresaR(): void {
    this.restorani.sort(function (r1, r2) {
      return r1.adresa.localeCompare(r2.adresa);
    });
  }

  sortirajTipO(): void {
    this.restorani.sort(function (r1, r2) {
      return r2.tip.localeCompare(r1.tip);
    });
  }

  sortirajTipR(): void {
    this.restorani.sort(function (r1, r2) {
      return r1.tip.localeCompare(r2.tip);
    });
  }
}
