import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Konobar } from 'src/app/models/Konobar';
import { Krug } from 'src/app/models/Krug';
import { Restoran } from 'src/app/models/Restoran';
import { Rezervacija } from 'src/app/models/Rezervacija';
import { RestoranService } from 'src/app/services/restoran.service';
import { RezervacijaService } from 'src/app/services/rezervacija.service';

@Component({
  selector: 'app-konobar-rezervacije',
  templateUrl: './konobar-rezervacije.component.html',
  styleUrls: ['./konobar-rezervacije.component.css'],
})
export class KonobarRezervacijeComponent implements OnInit {
  constructor(
    private rezService: RezervacijaService,
    private restService: RestoranService,
    private router: Router
  ) {}

  konobar: Konobar = new Konobar();
  restoran: Restoran = new Restoran();
  neobradjene: Rezervacija[] = [];
  prihvacene: Rezervacija[] = [];
  potvrdjene: Rezervacija[] = [];

  odbijanje: Rezervacija = new Rezervacija();
  komentar: string = '';

  prihvatanje: Rezervacija = new Rezervacija();
  prekoForme: boolean = false;

  slobodniStolovi: Krug[] = [];
  lista: number[] = [];
  canvas: any;
  izabranSto: number = -1;
  klik1X: number = -1;
  klik1Y: number = -1;
  visinaHTML: number = 0;
  sirinaHTML: number = 0;
  visinaAng: number = 0;
  sirinaAng: number = 0;

  greska: string = '';

  produziGreska: string = '';

  ngOnInit(): void {
    let ss = sessionStorage.getItem('konobar');
    if (ss == null || ss == '') {
      return;
    }
    this.konobar = JSON.parse(ss);
    this.restService
      .dohvatiRestoranId(this.konobar.restoran)
      .subscribe((data) => {
        if (data == null) {
          alert('Greska: ne postoji restoran');
          this.router.navigate(['konobari/profil']);
        } else {
          this.restoran = data;
        }
      });
    this.dohvatiRezervacije();
    this.sakrijCanvas();
  }

  dohvatiRezervacije() {
    this.rezService
      .dohvatiNeobradjene(this.konobar.restoran)
      .subscribe((data) => {
        if (data == null) this.neobradjene = [];
        else this.neobradjene = data;
        this.neobradjene.sort((rez1, rez2) => {
          return (
            (rez1.dan_posete - rez2.dan_posete) * 24 * 60 +
            (rez1.pocetak - rez2.pocetak)
          );
        });
      });
    this.rezService
      .dohvatiPrihvacene(this.konobar.restoran, this.konobar.kor_ime)
      .subscribe((data) => {
        this.prihvacene = [];
        this.potvrdjene = [];
        if (data != null) {
          data.sort((rez1, rez2) => {
            return (
              (rez1.dan_posete - rez2.dan_posete) * 24 * 60 +
              (rez1.pocetak - rez2.pocetak)
            );
          });
          for (let r of data) {
            if (r.status == 'u toku') this.prihvacene.push(r);
            else this.potvrdjene.push(r);
          }
        }
      });
  }

  produziRezervaciju(id: number) {
    this.produziGreska = '';
    this.greska = '';
    this.rezService.produziRezervaciju(id).subscribe((data) => {
      if (data.poruka != 'ok') {
        this.produziGreska = data.poruka;
      } else {
        this.dohvatiRezervacije();
      }
    });
  }

  mozePotvrditi(rezervacija: Rezervacija): boolean {
    let ms = Date.now();
    let minut = 60 * 1000;
    let brojMinuta = Math.floor(ms / minut) - new Date().getTimezoneOffset();
    console.log('M ' + brojMinuta);
    console.log(
      brojMinuta - (rezervacija.dan_posete * 24 * 60 + rezervacija.pocetak)
    );
    return (
      brojMinuta - (rezervacija.dan_posete * 24 * 60 + rezervacija.pocetak) >=
      30
    );
  }

  posecenaRezervacija(id: number) {
    this.produziGreska = '';
    this.rezService.posecenaRezervacija(id).subscribe((data) => {
      this.dohvatiRezervacije();
    });
  }

  propustenaRezervacija(id: number) {
    this.produziGreska = '';
    this.rezService.propustenaRezervacija(id).subscribe((data) => {
      this.dohvatiRezervacije();
    });
  }

  prosiriString(str: string, n: number, c: string) {
    let rezultat = str;
    while (rezultat.length < n) rezultat = c + rezultat;
    return rezultat;
  }

  odrediDatum(dan: number, pocetak: number) {
    let datum = new Date(dan * 24 * 60 * 60 * 1000+1);
    let g = this.prosiriString(datum.getFullYear().toString(), 4, '0');
    let m = this.prosiriString((datum.getMonth() + 1).toString(), 2, '0');
    let d = this.prosiriString(datum.getDate().toString(), 2, '0');
    let hh = this.prosiriString(Math.floor(pocetak / 60).toString(), 2, '0');
    let mm = this.prosiriString((pocetak % 60).toString(), 2, '0');
    return g + '-' + m + '-' + d + ' ' + hh + ':' + mm;
  }

  pokreniOdbij(rezervacija: Rezervacija) {
    this.greska = '';
    this.produziGreska = '';
    this.odbijanje = rezervacija;
    this.komentar = '';
    this.prihvatanje = new Rezervacija();
    this.prekoForme = false;
    this.sakrijCanvas();
  }

  odustaniOdbij(): void {
    this.produziGreska = '';
    this.odbijanje = new Rezervacija();
    this.komentar = '';
  }

  zavrsiOdbij(): void {
    this.produziGreska = '';
    this.rezService
      .odbijRezervaciju(this.odbijanje.id, this.komentar)
      .subscribe((data) => {
        this.dohvatiRezervacije();

        this.odbijanje = new Rezervacija();
        this.komentar = '';
      });
  }

  pokreniPrihvati(rezervacija: Rezervacija) {
    this.greska = '';
    this.produziGreska = '';
    this.odbijanje = new Rezervacija();
    this.komentar = '';
    this.prihvatanje = rezervacija;
    this.prekoForme = this.prihvatanje.sto == -1;
    this.izabranSto = -1;
    if (this.prekoForme) {
      this.prikaziCanvas();
      this.rezService
        .dohvatiZauzeteStoloveKonobar(
          this.restoran.id,
          this.prihvatanje.dan_posete,
          this.prihvatanje.pocetak
        )
        .subscribe((data) => {
          if (data == null) this.slobodniStolovi = [];
          else {
            this.slobodniStolovi = JSON.parse(
              JSON.stringify(this.restoran.raspored.stolovi)
            );
            for (let i = 0; i < this.restoran.raspored.stolovi.length; i++) {
              if (data.includes(i)) {
                this.slobodniStolovi[i].kap = -1;
              }
            }
            this.inicijalizujCanvas();
          }
        });
    } else {
      this.rezService
        .dohvatiZauzeteStoloveKonobar(
          this.restoran.id,
          this.prihvatanje.dan_posete,
          this.prihvatanje.pocetak
        )
        .subscribe((data) => {
          if (data == null) this.slobodniStolovi = [];
          else {
            this.slobodniStolovi = JSON.parse(
              JSON.stringify(this.restoran.raspored.stolovi)
            );
            for (let i = 0; i < this.restoran.raspored.stolovi.length; i++) {
              if (data.includes(i)) {
                this.slobodniStolovi[i].kap = -1;
              }
            }
            this.prikaziCanvas();
            this.izabranSto = this.prihvatanje.sto;
            if (this.slobodniStolovi[this.prihvatanje.sto].kap == -1) {
              this.greska = 'Izabrani sto je vec zauzet';
              console.log(this.greska);
            }
            this.inicijalizujCanvas();
          }
        });
    }
  }

  izaberi(): void {
    this.produziGreska = '';
    this.greska = '';
    this.nacrtajCanvas();
  }

  odustaniPrihvati() {
    this.produziGreska = '';
    this.prihvatanje = new Rezervacija();
    this.sakrijCanvas();
  }

  zavrsiPrihvati() {
    this.produziGreska = '';
    if (this.izabranSto == -1) {
      this.greska = 'Niste izabrali sto za rezervaciju';
      return;
    }
    this.rezService
      .prihvatiRezervaciju(
        this.prihvatanje.id,
        this.konobar.kor_ime,
        this.izabranSto
      )
      .subscribe((data) => {
        if (data.poruka != 'ok') {
          this.greska = data.poruka;
        } else {
          this.prihvatanje = new Rezervacija();
          this.sakrijCanvas();
          this.dohvatiRezervacije();
        }
      });
  }

  sakrijCanvas() {
    let div = document.getElementById('div_canvas');
    if (div == null) return;
    div.hidden = true;
  }

  prikaziCanvas() {
    let div = document.getElementById('div_canvas');
    if (div == null) return;
    div.hidden = false;
    this.izabranSto = -1;
  }

  inicijalizujCanvas() {
    this.canvas = <HTMLCanvasElement>document.getElementById('canvas_konobar');
    if (this.canvas == null) return;
    this.canvas.addEventListener('mousedown', (e: Event) => {
      e.preventDefault();
      this.klikni(this.canvas, e);
    });
    this.canvas.addEventListener('contextmenu', (event: any) => {
      event.preventDefault();
    });
    this.visinaHTML = this.canvas.height;
    this.sirinaHTML = this.canvas.width;
    this.visinaAng = this.restoran.raspored.visina;
    this.sirinaAng = this.restoran.raspored.sirina;
    this.nacrtajCanvas();
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
      'Restoran: ' + this.prihvatanje.naziv_restorana,
      'black',
      '#e5f0bb'
    );
  }

  nacrtajDatum(ctx: CanvasRenderingContext2D): void {
    let datumVreme = this.odrediDatum(
      this.prihvatanje.dan_posete,
      this.prihvatanje.pocetak
    );
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
      'Termin: ' + datumVreme,
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
      let boja = '';
      if (sto.kap > 0 && this.izabranSto == i) boja = 'yellow';
      else if (sto.kap > 0) boja = 'white';
      else if (this.izabranSto == i) boja = 'rgb(255,150,0)';
      else boja = 'red';
      this.nacrtajElipsu(
        ctx,
        5 + this.proporcije(sto.x, this.sirinaHTML - 10, this.sirinaAng),
        40 + this.proporcije(sto.y, this.visinaHTML - 45, this.visinaAng),
        this.proporcije(sto.r, this.sirinaHTML - 10, this.sirinaAng),
        this.proporcije(sto.r, this.visinaHTML - 45, this.visinaAng),
        'black',
        boja
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
          boja
        );
      }
    }
  }

  proporcije(original: number, dimenzijaHtml: number, dimenzijaAng: number) {
    return Math.round((original * dimenzijaHtml) / dimenzijaAng);
  }

  klikni(canvas: HTMLCanvasElement, event: any) {
    if (!this.prekoForme) return;
    if ((<MouseEvent>event).button != 0) return;
    this.produziGreska = '';
    this.greska = '';
    const rect = canvas.getBoundingClientRect();
    let ex = parseInt(event.clientX.toString());
    let ey = parseInt(event.clientY.toString());
    let cx = parseInt(rect.left.toString());
    let cy = parseInt(rect.top.toString());
    let x = this.proporcije(ex - cx - 5, this.sirinaAng, this.sirinaHTML - 10);
    let y = this.proporcije(ey - cy - 40, this.visinaAng, this.visinaHTML - 45);
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
      for (let i = 0; i < this.restoran.raspored.stolovi.length; i++) {
        let sto = this.restoran.raspored.stolovi[i];
        if (Math.floor(Math.hypot(sto.x - x, sto.y - y)) <= sto.r) {
          prazno = false;
          if (this.slobodniStolovi[i].kap > 0) {
            this.izabranSto = i;
            break;
          }
        }
      }
    if (prazno) this.izabranSto = -1;
    this.nacrtajCanvas();
  }

  range(a: number, b: number) {
    let arr = <number[]>[];
    for (let i = a; i < b; i++) {
      arr.push(i);
    }
    return arr;
  }
}
