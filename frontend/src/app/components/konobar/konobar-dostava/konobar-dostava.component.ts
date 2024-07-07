import { Component, OnInit } from '@angular/core';
import { Dostava } from 'src/app/models/Dostava';
import { Konobar } from 'src/app/models/Konobar';
import { DostavaService } from 'src/app/services/dostava.service';

@Component({
  selector: 'app-konobar-dostava',
  templateUrl: './konobar-dostava.component.html',
  styleUrls: ['./konobar-dostava.component.css'],
})
export class KonobarDostavaComponent implements OnInit {
  constructor(private dService: DostavaService) {}

  konobar: Konobar = new Konobar();
  narudzbine: Dostava[] = [];

  izborNarudzbina: number = 0;
  izborVrednost: number = 0;

  ucitajNarudzbine(): void {
    this.dService
      .dohvatiNeobradjene(this.konobar.restoran)
      .subscribe((data) => {
        if (data) this.narudzbine = data;
        else this.narudzbine = [];
      });
  }

  ngOnInit(): void {
    let ss_konobar = sessionStorage.getItem('konobar');
    if (ss_konobar) this.konobar = JSON.parse(ss_konobar);
    this.ucitajNarudzbine();
    this.izborNarudzbina = -1;
  }

  odbijNarudzbinu(id: number) {
    this.dService.odbijDostavu(id, this.konobar.restoran).subscribe((data) => {
      if (data) this.narudzbine = data;
      else this.narudzbine = [];
    });
  }

  nazad() {
    this.izborNarudzbina = -1;
  }

  upit(id: number) {
    this.izborNarudzbina = id;
    this.izborVrednost = 20;
  }

  prihvatiNarudzbinu() {
    let vreme = Date.now() + this.izborVrednost * 60 * 1000;
    this.dService
      .prihvatiDostavu(this.izborNarudzbina, this.konobar.restoran, vreme)
      .subscribe((data) => {
        if (data) this.narudzbine = data;
        else this.narudzbine = [];
      });
  }

  odrediDatum(ms: number) {
    let datum = new Date(ms - new Date().getTimezoneOffset() * 60 * 1000);
    let str = datum.toISOString();
    str = str.replace('T', ' ');
    return str.substring(0, 16);
  }
}
