import { Component, OnInit } from '@angular/core';
import { Dostava } from 'src/app/models/Dostava';
import { Gost } from 'src/app/models/Gost';
import { DostavaService } from 'src/app/services/dostava.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-gost-dostava',
  templateUrl: './gost-dostava.component.html',
  styleUrls: ['./gost-dostava.component.css'],
})
export class GostDostavaComponent implements OnInit {
  constructor(private dService: DostavaService) {}

  gost: Gost = new Gost();
  dostave: Dostava[] = [];
  aktuelne: number[] = [];
  arhivirane: number[] = [];
  vreme: string[] = [];

  sub: Subscription = new Subscription();

  osveziDostave(): void {
    this.aktuelne = [];
    this.arhivirane = [];
    for (let i = 0; i < this.dostave.length; i++) {
      if (this.dostave[i].status == 'neobradjena') this.aktuelne.push(i);
      else if (this.dostave[i].procenjeno_vreme >= Date.now())
        this.aktuelne.push(i);
      else this.arhivirane.push(i);
    }
    this.aktuelne = this.aktuelne.reverse();
    for (let i of this.aktuelne) {
      if (this.dostave[i].status == 'prihvacena')
        this.vreme[i] = this.preostaloVremeDostave(i);
      else this.vreme[i] = '-';
    }
    for (let i of this.arhivirane) {
      if (this.dostave[i].status == 'prihvacena') this.vreme[i] = this.datum(i);
      else this.vreme[i] = '-';
    }
  }

  brojUString(n: number, brNula: number) {
    let str = n.toString();
    while (str.length < brNula) str = '0' + str;
    return str;
  }

  datum(ind: number) {
    let datumNaruceno = new Date(this.dostave[ind].procenjeno_vreme);
    let str = '';
    str += this.brojUString(datumNaruceno.getFullYear(), 4) + '-';
    str += this.brojUString(datumNaruceno.getMonth() + 1, 2) + '-';
    str += this.brojUString(datumNaruceno.getDate(), 2) + ' ';
    str += this.brojUString(datumNaruceno.getHours(), 2) + ':';
    str += this.brojUString(datumNaruceno.getMinutes(), 2) + ':';
    str += this.brojUString(datumNaruceno.getSeconds(), 2);
    return str;
  }

  preostaloVremeDostave(ind: number) {
    let razlika = this.dostave[ind].procenjeno_vreme - Date.now();
    let sekunde = Math.floor(razlika / 1000);
    let sati = Math.floor(sekunde / 3600);
    sekunde = sekunde % 3600;
    let minuti = Math.floor(sekunde / 60);
    sekunde = sekunde % 60;
    return (
      'Za ' +
      this.brojUString(sati, 2) +
      'h ' +
      this.brojUString(minuti, 2) +
      'm ' +
      this.brojUString(sekunde, 2) +
      's'
    );
  }

  ngOnInit(): void {
    let ss_gost = sessionStorage.getItem('gost');
    if (ss_gost) this.gost = JSON.parse(ss_gost);
    this.dService.dohvatiDostaveGost(this.gost.kor_ime).subscribe((data) => {
      if (data) this.dostave = data;
      else {
        this.dostave = [];
      }
      this.vreme = [];
      for (let d of this.dostave) this.vreme.push('');
      this.osveziDostave();
      this.sub = interval(1000).subscribe((ok) => this.osveziDostave());
    });
  }
}
