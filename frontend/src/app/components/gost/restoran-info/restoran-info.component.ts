import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Gost } from 'src/app/models/Gost';
import { Jelo } from 'src/app/models/Jelo';
import { Krug } from 'src/app/models/Krug';
import { Ocena } from 'src/app/models/Ocena';
import { Raspored } from 'src/app/models/Raspored';
import { Restoran } from 'src/app/models/Restoran';
import { Rezervacija } from 'src/app/models/Rezervacija';
import { JeloService } from 'src/app/services/jelo.service';
import { RestoranService } from 'src/app/services/restoran.service';
import { RezervacijaService } from 'src/app/services/rezervacija.service';

@Component({
  selector: 'app-restoran-info',
  templateUrl: './restoran-info.component.html',
  styleUrls: ['./restoran-info.component.css'],
})
export class RestoranInfoComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private restService: RestoranService,
    private rezService: RezervacijaService,
    private jService: JeloService,
    private http: HttpClient
  ) {}

  gost: Gost = new Gost();
  restoran: Restoran = new Restoran();
  slobodniStolovi: Krug[] = [];
  jela: Jelo[] = [];
  kolicine: string[] = [];
  poruke: string[] = [];
  greske: string[] = [];

  datum_vreme1: string = '';
  broj_ljudi1: string = '';
  zahtevi1: string = '';
  rezervacija1_greska = '';
  rezervacija1_poruka = '';

  datum_vreme2: string = '';
  pocetak: number = 0;
  dan: number = 0;
  canvas: any;
  izabran_sto: number = -1;
  broj_ljudi2: string = '';
  zahtevi2: string = '';
  rezervacija2_greska = '';
  rezervacija2_poruka = '';
  klik1X: number = -1;
  klik1Y: number = -1;
  visinaHTML: number = 0;
  sirinaHTML: number = 0;
  visinaAng: number = 0;
  sirinaAng: number = 0;

  ngOnInit(): void {
    this.canvas = <HTMLCanvasElement>document.getElementById('canvas_gost');
    if (this.canvas == null) this.router.navigate(['gosti/restorani']);
    this.canvas.addEventListener('mousedown', (e: Event) => {
      e.preventDefault();
      this.klikni(this.canvas, e);
    });
    this.canvas.addEventListener('contextmenu', (event: any) => {
      event.preventDefault();
    });
    this.visinaHTML = this.canvas.height;
    this.sirinaHTML = this.canvas.width;
    let ss_gost = sessionStorage.getItem('gost');
    if (ss_gost != null) this.gost = JSON.parse(ss_gost);
    let id = this.route.snapshot.queryParams['restoran'];
    this.restService.dohvatiRestoranId(id).subscribe((data) => {
      if (data) {
        this.restoran = data;
        this.jService.dohvatiJela(this.restoran.id).subscribe((data) => {
          if (data) this.jela = data;
          for (let j of this.jela) {
            this.poruke.push('');
            this.greske.push('');
            this.kolicine.push('');
          }
        });
        this.slobodniStolovi = this.restoran.raspored.stolovi;
        this.visinaAng = this.restoran.raspored.visina;
        this.sirinaAng = this.restoran.raspored.sirina;
        this.nacrtajCanvas();
      } else {
        this.router.navigate(['gosti/restorani']);
      }
    });
  }

  nazad():void{
    this.router.navigate(['gosti/restorani']);
  }

  prosek(ocene: Ocena[]) {
    let suma = 0.0;
    let brojOcena = 0;
    for (let o of ocene) {
      suma += o.broj;
      brojOcena++;
    }
    if (brojOcena > 0) return Math.round((suma * 100.0) / brojOcena) / 100.0;
    else return 0;
  }

  zvezde(pr: number) {
    let urls = <number[]>[];
    while (pr >= 0.75) {
      urls.push(2);
      pr--;
    }
    while (pr >= 0.25) {
      urls.push(1);
      pr--;
    }
    while (urls.length < 5) urls.push(0);
    return urls;
  }

  mapaUrl(adresa: string) {
    let mapaUrl1 = 'https://maps.google.com/maps?q=';
    let mapaUrl2 = '&t=&z=16&ie=UTF8&iwloc=&output=embed';
    let fullUrl = mapaUrl1 + adresa.replaceAll(' ', '%20') + mapaUrl2;
    return fullUrl;
  }

  range(a: number, b: number) {
    let arr = <number[]>[];
    for (let i = a; i < b; i++) arr.push(i);
    return arr;
  }

  dodajUKorpu(ind: number) {
    this.rezervacija1_greska = this.rezervacija1_poruka = '';
    this.rezervacija2_greska = this.rezervacija2_poruka = '';
    for (let i = 0; i < this.jela.length; i++) {
      this.greske[i] = this.poruke[i] = '';
      if (i == ind) continue;
      this.kolicine[i] = '';
    }
    if (!new RegExp(/^[ ]*[-]?[0-9]+(\.[0-9]+)?$/).test(this.kolicine[ind])) {
      this.greske[ind] = 'Los format kolicine';
      return;
    }
    let kolicina = Number.parseFloat(this.kolicine[ind]);
    if (kolicina <= 0) {
      this.greske[ind] = 'Kolicina mora da bude pozitivan broj';
      return;
    }
    if (kolicina > 100) {
      this.greske[ind] = 'Kolicina je suvise velika';
      return;
    }
    kolicina = Math.floor(kolicina * 1000) / 1000;
    if (kolicina <= 0) {
      this.greske[ind] = 'Kolicina je suvise mala';
      return;
    }
    this.kolicine[ind]=kolicina.toString();
    this.jService
      .dodajUKorpu(
        this.gost.kor_ime,
        this.jela[ind].id,
        this.restoran.id,
        kolicina
      )
      .subscribe((data) => {
        if (data)
          this.poruke[ind] =
            'Dodato je ' +
            kolicina +
            " kg/L jela '" +
            this.jela[ind].naziv +
            "'";
        else {
          this.greske[ind] = 'Greska pri dodavanju jela u korpu';
        }
      });
  }

  prikaziKorpu(): void {
    this.router.navigate(['gosti/restorani/korpa'], {
      queryParams: { restoran: this.restoran.id },
    });
  }

  rezervacija1(): void {
    this.rezervacija1_greska = this.rezervacija1_poruka = '';
    this.rezervacija2_greska = this.rezervacija2_poruka = '';
    for (let i = 0; i < this.kolicine.length; i++) {
      this.kolicine[i] = '';
      this.poruke[i] = '';
      this.greske[i] = '';
    }
    if (this.datum_vreme1 == undefined || this.datum_vreme1 == '') {
      this.rezervacija1_greska = 'Datum i vreme nisu dobro definisani';
      return;
    }
    if (!new RegExp(/^[ ]*[1-9][0-9]*[ ]*$/).test(this.broj_ljudi1)) {
      this.rezervacija1_greska = 'Broj osoba nije u dobrom formatu';
      return;
    }
    let datum_godine = Number.parseInt(this.datum_vreme1.substring(0, 4));
    let datum_meseci = Number.parseInt(this.datum_vreme1.substring(5, 7)) - 1;
    let datum_dani = Number.parseInt(this.datum_vreme1.substring(8, 10));
    let datum_sati = Number.parseInt(this.datum_vreme1.substring(11, 13));
    let datum_minuti = Number.parseInt(this.datum_vreme1.substring(14, 16));
    let datumG = new Date();
    datumG.setFullYear(datum_godine);
    datumG.setMonth(datum_meseci);
    datumG.setDate(datum_dani);
    datumG.setHours(datum_sati);
    datumG.setMinutes(datum_minuti);
    datumG.setSeconds(1);
    datumG.setMilliseconds(1);
    let datum = new Date(
      datumG.getTime() - new Date().getTimezoneOffset() * 60 * 1000
    );
    let dan_posete = Math.floor(datum.getTime() / (24 * 3600 * 1000));
    let pocetak = Math.floor(
      (datum.getTime() % (24 * 3600 * 1000)) / (60 * 1000)
    );
    let novaRezervacija = new Rezervacija();
    novaRezervacija.datum_prijave = Date.now();
    novaRezervacija.dan_posete = dan_posete;
    novaRezervacija.pocetak = pocetak;
    novaRezervacija.gost = this.gost.kor_ime;
    novaRezervacija.restoran = this.restoran.id;
    novaRezervacija.sto = -1;
    novaRezervacija.broj_ljudi = Number.parseInt(this.broj_ljudi1);
    novaRezervacija.zahtevi = this.zahtevi1;
    this.rezService.posaljiRezervaciju1(novaRezervacija).subscribe((data) => {
      if (data.poruka == 'ok') {
        this.rezervacija1_poruka = 'Ceka se potvrda rezervacije';
      } else {
        this.rezervacija1_greska = data.poruka;
      }
    });
  }

  nacrtajKvadrat(
    ctx: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    bojaLinije: string,
    bojaPozadine: string,
    coskovi: number = 1
  ) {
    ctx.save();

    ctx.fillStyle = bojaPozadine;
    ctx.strokeStyle = bojaLinije;
    ctx.lineWidth = 2;
    if (coskovi) {
      ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
      ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
    } else {
      ctx.beginPath();
      ctx.roundRect(x1, y1, x2 - x1, y2 - y1, [10, 10, 10, 10]);
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();
  }

  nacrtajElipsu(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    rx: number,
    ry: number,
    bojaLinije: string,
    bojaPozadine: string
  ) {
    ctx.save();

    ctx.fillStyle = bojaPozadine;
    ctx.strokeStyle = bojaLinije;
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();

    ctx.restore();
  }

  nacrtajTekst(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    h: number,
    tekst: string,
    bojaTeksta: string,
    bojaPozadine: string
  ) {
    ctx.save();
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(tekst, x, y + h / 2 + 3);
    ctx.restore();
  }

  nacrtajTacku(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    bojaLinije: string,
    bojaPozadine: string
  ) {
    ctx.save();
    ctx.fillStyle = bojaPozadine;
    ctx.strokeStyle = bojaLinije;
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  nacrtajNaslov(ctx: CanvasRenderingContext2D): void {
    this.nacrtajKvadrat(ctx, 5, 5, 305, 35, 'black', '#e5f0bb', 0);
    this.nacrtajTekst(
      ctx,
      150,
      5,
      30,
      'Restoran: ' + this.restoran.naziv,
      'black',
      '#e5f0bb'
    );
  }

  nacrtajDatum(ctx: CanvasRenderingContext2D): void {
    if (this.datum_vreme2 == '') return;
    this.datum_vreme2 = this.datum_vreme2.replace('T', ' ');
    this.nacrtajKvadrat(
      ctx,
      this.sirinaHTML - 155,
      5,
      this.sirinaHTML - 5,
      35,
      'black',
      '#a1b4ff',
      0
    );
    this.nacrtajTekst(
      ctx,
      this.sirinaHTML - 80,
      5,
      30,
      'Termin: ' + this.datum_vreme2,
      'black',
      '#a1b4ff'
    );
  }

  nacrtajCanvas(): void {
    let ctx = this.canvas.getContext('2d');
    if (ctx == null) return;
    this.nacrtajKvadrat(
      ctx,
      0,
      0,
      this.sirinaHTML,
      this.visinaHTML,
      'black',
      'white'
    );
    if (this.slobodniStolovi.length == 0) {
      return;
    }
    if (this.datum_vreme2 == '') return;
    this.nacrtajKvadrat(
      ctx,
      5,
      40,
      this.sirinaHTML - 5,
      this.visinaHTML - 5,
      'black',
      'white',
      0
    );
    this.nacrtajNaslov(ctx);
    this.nacrtajDatum(ctx);
    for (let k of this.restoran.raspored.kuhinje) {
      this.nacrtajKvadrat(
        ctx,
        5 + this.proporcije(k.x1, this.sirinaHTML - 10, this.sirinaAng),
        40 + this.proporcije(k.y1, this.visinaHTML - 45, this.visinaAng),
        5 + this.proporcije(k.x2, this.sirinaHTML - 10, this.sirinaAng),
        40 + this.proporcije(k.y2, this.visinaHTML - 45, this.visinaAng),
        'black',
        'white'
      );
      this.nacrtajTekst(
        ctx,
        5 +
          this.proporcije(
            (k.x1 + k.x2) / 2,
            this.sirinaHTML - 10,
            this.sirinaAng
          ),
        40 + this.proporcije(k.y1, this.visinaHTML - 45, this.visinaAng),
        this.proporcije(k.y2 - k.y1, this.visinaHTML - 45, this.visinaAng),
        'KUHINJA',
        'black',
        'white'
      );
    }
    for (let t of this.restoran.raspored.toaleti) {
      this.nacrtajKvadrat(
        ctx,
        5 + this.proporcije(t.x1, this.sirinaHTML - 10, this.sirinaAng),
        40 + this.proporcije(t.y1, this.visinaHTML - 45, this.visinaAng),
        5 + this.proporcije(t.x2, this.sirinaHTML - 10, this.sirinaAng),
        40 + this.proporcije(t.y2, this.visinaHTML - 45, this.visinaAng),
        'black',
        'white'
      );
      this.nacrtajTekst(
        ctx,
        5 +
          this.proporcije(
            (t.x1 + t.x2) / 2,
            this.sirinaHTML - 10,
            this.sirinaAng
          ),
        40 + this.proporcije(t.y1, this.visinaHTML - 45, this.visinaAng),
        this.proporcije(t.y2 - t.y1, this.visinaHTML - 45, this.visinaAng),
        'TOALET',
        'black',
        'white'
      );
    }
    for (let i = 0; i < this.slobodniStolovi.length; i++) {
      let sto = this.slobodniStolovi[i];
      let boja = sto.kap > 0 ? 'white' : 'red';
      this.nacrtajElipsu(
        ctx,
        5 + this.proporcije(sto.x, this.sirinaHTML - 10, this.sirinaAng),
        40 + this.proporcije(sto.y, this.visinaHTML - 45, this.visinaAng),
        this.proporcije(sto.r, this.sirinaHTML - 10, this.sirinaAng),
        this.proporcije(sto.r, this.visinaHTML - 45, this.visinaAng),
        'black',
        this.izabran_sto == i ? 'green' : boja
      );
      if (sto.kap > 0) {
        this.nacrtajTekst(
          ctx,
          5 + this.proporcije(sto.x, this.sirinaHTML - 10, this.sirinaAng),
          40 +
            this.proporcije(
              sto.y - sto.r,
              this.visinaHTML - 45,
              this.visinaAng
            ),
          this.proporcije(2 * sto.r, this.visinaHTML - 45, this.visinaAng),
          sto.kap.toString(),
          'black',
          this.izabran_sto == i ? 'green' : boja
        );
      }
    }
  }

  proporcije(original: number, dimenzijaHtml: number, dimenzijaAng: number) {
    return Math.round((original * dimenzijaHtml) / dimenzijaAng);
  }

  klikni(canvas: HTMLCanvasElement, event: any) {
    if ((<MouseEvent>event).button != 0) return;
    this.rezervacija2_greska = this.rezervacija2_poruka = '';
    const rect = canvas.getBoundingClientRect();
    let ex = parseInt(event.clientX.toString());
    let ey = parseInt(event.clientY.toString());
    let cx = parseInt(rect.left.toString());
    let cy = parseInt(rect.top.toString());
    let x = this.proporcije(ex - cx - 5, this.sirinaAng, this.sirinaHTML - 10);
    let y = this.proporcije(ey - cy - 40, this.visinaAng, this.visinaHTML - 45);
    if (x < 0 || y < 0 || x > this.sirinaAng || y > this.visinaAng) return;
    let prazno = true;
    for (let kuhinja of this.restoran.raspored.kuhinje) {
      if (
        kuhinja.x1 <= x &&
        x <= kuhinja.x2 &&
        kuhinja.y1 <= y &&
        y <= kuhinja.y2
      ) {
        prazno = false;
        break;
      }
    }
    if (prazno)
      for (let toalet of this.restoran.raspored.toaleti) {
        if (
          toalet.x1 <= x &&
          x <= toalet.x2 &&
          toalet.y1 <= y &&
          y <= toalet.y2
        ) {
          prazno = false;
          break;
        }
      }
    if (prazno)
      for (let i = 0; i < this.slobodniStolovi.length; i++) {
        let sto = this.slobodniStolovi[i];
        if (Math.floor(Math.hypot(sto.x - x, sto.y - y)) <= sto.r) {
          prazno = false;
          if (sto.kap > 0) this.izabran_sto = i;
          break;
        }
      }
    if (prazno) this.izabran_sto = -1;
    this.nacrtajCanvas();
  }

  proveriStolove(): void {
    this.rezervacija1_greska = this.rezervacija1_poruka = '';
    this.rezervacija2_greska = this.rezervacija2_poruka = '';
    for (let i = 0; i < this.kolicine.length; i++) {
      this.kolicine[i] = '';
      this.poruke[i] = '';
      this.greske[i] = '';
    }
    this.izabran_sto = -1;
    if (this.datum_vreme2 == undefined || this.datum_vreme2 == '') {
      this.rezervacija2_greska = 'Datum i vreme nisu dobro definisani';
      this.nacrtajCanvas();
      return;
    }
    let datum_godine = Number.parseInt(this.datum_vreme2.substring(0, 4));
    let datum_meseci = Number.parseInt(this.datum_vreme2.substring(5, 7)) - 1;
    let datum_dani = Number.parseInt(this.datum_vreme2.substring(8, 10));
    let datum_sati = Number.parseInt(this.datum_vreme2.substring(11, 13));
    let datum_minuti = Number.parseInt(this.datum_vreme2.substring(14, 16));
    let datum = new Date();
    datum.setFullYear(datum_godine);
    datum.setMonth(datum_meseci);
    datum.setDate(datum_dani);
    datum.setHours(datum_sati);
    datum.setMinutes(datum_minuti);
    datum.setSeconds(0);
    if (datum.getTime() <= Date.now()) {
      this.rezervacija2_greska = 'Datum mora biti u buducnosti';
      return;
    }
    let ukupno_minuta = Math.floor(datum.getTime() / 60000);
    this.pocetak = (ukupno_minuta % (24 * 60)) - datum.getTimezoneOffset();
    this.dan = Math.floor(ukupno_minuta / (24 * 60));
    this.rezService
      .dohvatiZauzeteStoloveGost(
        this.gost.kor_ime,
        this.restoran.id,
        this.dan,
        this.pocetak
      )
      .subscribe((data) => {
        if (data) {
          this.slobodniStolovi = [];
          if (data.length > 0 && data[0] == -1) {
            this.rezervacija2_greska = 'Greska pri radu sa bazom';
          } else if (data.length > 0 && data[0] == -2) {
            this.rezervacija2_greska = 'Restoran ne radi taj dan';
          } else if (data.length > 0 && data[0] == -3) {
            this.rezervacija2_greska = 'Restoran ne radi u tom terminu';
          } else if (data.length > 0 && data[0] == -4) {
            this.rezervacija2_greska =
              'Nemate dozvolu da pravite nove rezervacije';
          } else {
            this.slobodniStolovi = JSON.parse(
              JSON.stringify(this.restoran.raspored.stolovi)
            );
            for (let i of data) this.slobodniStolovi[i].kap = -1;
            this.zahtevi2="";
            this.broj_ljudi2="";
          }
          this.nacrtajCanvas();
        }
      });
  }

  rezervacija2(): void {
    this.rezervacija1_greska = this.rezervacija1_poruka = '';
    this.rezervacija2_greska = this.rezervacija2_poruka = '';
    for (let i = 0; i < this.kolicine.length; i++) {
      this.kolicine[i] = '';
      this.poruke[i] = '';
      this.greske[i] = '';
    }
    if (!new RegExp(/^[ ]*[1-9][0-9]*[ ]*$/).test(this.broj_ljudi2)) {
      this.rezervacija2_greska = 'Broj osoba nije u dobrom formatu';
      return;
    }
    let broj = Number.parseInt(this.broj_ljudi2);
    if (broj > this.slobodniStolovi[this.izabran_sto].kap) {
      this.rezervacija2_greska = 'Izabrani sto je premali za sve goste';
      return;
    }
    let novaRezervacija = new Rezervacija();
    novaRezervacija.adresa_restorana = this.restoran.adresa;
    novaRezervacija.broj_ljudi = Number.parseInt(this.broj_ljudi2);
    novaRezervacija.dan_posete = this.dan;
    novaRezervacija.pocetak = this.pocetak;
    novaRezervacija.datum_prijave = Date.now();
    novaRezervacija.gost = this.gost.kor_ime;
    novaRezervacija.naziv_restorana = this.restoran.naziv;
    novaRezervacija.restoran = this.restoran.id;
    novaRezervacija.zahtevi = this.zahtevi2;
    novaRezervacija.sto = this.izabran_sto;
    this.rezService.posaljiRezervaciju2(novaRezervacija).subscribe((data) => {
      if (data.poruka == 'ok') {
        this.rezervacija2_poruka = 'Rezervacija je uspesno poslata';
        this.izabran_sto = -1;
        this.rezService
          .dohvatiZauzeteStoloveGost(
            this.gost.kor_ime,
            this.restoran.id,
            this.dan,
            this.pocetak
          )
          .subscribe((data) => {
            if (data) {
              this.slobodniStolovi = JSON.parse(
                JSON.stringify(this.restoran.raspored.stolovi)
              );
              for (let i of data) {
                if (i >= 0) this.slobodniStolovi[i].kap = -1;
              }
            } else this.slobodniStolovi = [];
            this.nacrtajCanvas();
          });
      } else {
        this.rezervacija2_greska = data.poruka;
      }
    });
  }
}
