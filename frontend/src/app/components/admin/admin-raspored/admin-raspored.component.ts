import { Component, OnInit } from '@angular/core';
import { Krug } from 'src/app/models/Krug';
import { Kvadrat } from 'src/app/models/Kvadrat';
import { Raspored } from 'src/app/models/Raspored';

@Component({
  selector: 'app-admin-raspored',
  templateUrl: './admin-raspored.component.html',
  styleUrls: ['./admin-raspored.component.css'],
})
export class AdminRasporedComponent implements OnInit {
  constructor() {}

  raspored: Raspored = new Raspored();
  rasporedNaziv: string = '';
  rasporedGreska: string = '';
  formatGreske: string[] = [];
  novaVisina: string = '';
  novaSirina: string = '';
  kapacitet: number = 2;
  klik1X: number = -1;
  klik1Y: number = -1;
  visinaHTML: number = 1;
  sirinaHTML: number = 1;
  visinaAng: number = 1;
  sirinaAng: number = 1;
  canvas: any;
  mod: number = 0;
  oblik: number = 0;
  noviKapacitet: string = '2';

  ngOnInit(): void {
    this.canvas = <HTMLCanvasElement>document.getElementById('canvas_admin');
    if (this.canvas == null) return;
    this.canvas.addEventListener('mousedown', (e: Event) => {
      e.preventDefault();
      this.klikni(this.canvas, e);
    });
    this.visinaHTML = this.canvas.height;
    this.sirinaHTML = this.canvas.width;
    this.visinaAng = 300;
    this.sirinaAng = 450;
    this.raspored = new Raspored();
    this.raspored.sirina = 450;
    this.raspored.visina = 300;
    this.novaSirina = '450';
    this.novaVisina = '300';
    this.obrisiGreske();
    this.nacrtajCanvas();
  }

  dohvatiRaspored() {
    return this.raspored;
  }

  dohvatiGresku() {
    let proveraRasporeda = this.proveriRaspored(this.raspored);
    switch (proveraRasporeda) {
      case -1:
        return 'Mora da postoji bar jedna kuhinja u restoranu';
      case -2:
        return 'Mora da postoji bar jedan toalet u restoranu';
      case -3:
        return 'Mora da postoje bar tri stola u restoranu';
      case -4:
        return "Neki objekti se ne nalaze unutar 'dimenzija' restorana ili se medjusobno preklapaju";
      default:
        return '';
    }
  }

  dohvatiNaziv() {
    return this.rasporedNaziv;
  }

  proporcije(original: number, dimenzijaHtml: number, dimenzijaAng: number) {
    return Math.round((original * dimenzijaHtml) / dimenzijaAng);
  }

  nacrtajKvadrat(
    ctx: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    bojaLinije: string,
    bojaPozadine: string
  ) {
    ctx.save();

    ctx.fillStyle = bojaPozadine;
    ctx.strokeStyle = bojaLinije;
    ctx.lineWidth = 2;

    ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
    ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);

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
    for (let t of this.raspored.toaleti) {
      this.nacrtajKvadrat(
        ctx,
        this.proporcije(t.x1, this.sirinaHTML, this.sirinaAng),
        this.proporcije(t.y1, this.visinaHTML, this.visinaAng),
        this.proporcije(t.x2, this.sirinaHTML, this.sirinaAng),
        this.proporcije(t.y2, this.visinaHTML, this.visinaAng),
        'black',
        'white'
      );
      this.nacrtajTekst(
        ctx,
        this.proporcije((t.x1 + t.x2) / 2, this.sirinaHTML, this.sirinaAng),
        this.proporcije(t.y1, this.visinaHTML, this.visinaAng),
        this.proporcije(t.y2 - t.y1, this.visinaHTML, this.visinaAng),
        'TOALET',
        'black',
        'white'
      );
    }
    for (let k of this.raspored.kuhinje) {
      this.nacrtajKvadrat(
        ctx,
        this.proporcije(k.x1, this.sirinaHTML, this.sirinaAng),
        this.proporcije(k.y1, this.visinaHTML, this.visinaAng),
        this.proporcije(k.x2, this.sirinaHTML, this.sirinaAng),
        this.proporcije(k.y2, this.visinaHTML, this.visinaAng),
        'black',
        'white'
      );
      this.nacrtajTekst(
        ctx,
        this.proporcije((k.x1 + k.x2) / 2, this.sirinaHTML, this.sirinaAng),
        this.proporcije(k.y1, this.visinaHTML, this.visinaAng),
        this.proporcije(k.y2 - k.y1, this.visinaHTML, this.visinaAng),
        'KUHINJA',
        'black',
        'white'
      );
    }
    for (let s of this.raspored.stolovi) {
      this.nacrtajElipsu(
        ctx,
        this.proporcije(s.x, this.sirinaHTML, this.sirinaAng),
        this.proporcije(s.y, this.visinaHTML, this.visinaAng),
        this.proporcije(s.r, this.sirinaHTML, this.sirinaAng),
        this.proporcije(s.r, this.visinaHTML, this.visinaAng),
        'black',
        'white'
      );
      this.nacrtajTekst(
        ctx,
        this.proporcije(s.x, this.sirinaHTML, this.sirinaAng),
        this.proporcije(s.y - s.r, this.visinaHTML, this.visinaAng),
        this.proporcije(2 * s.r, this.visinaHTML, this.visinaAng),
        s.kap.toString(),
        'black',
        'white'
      );
    }
    if (this.klik1X != -1) {
      this.nacrtajTacku(
        ctx,
        this.proporcije(this.klik1X, this.sirinaHTML, this.sirinaAng),
        this.proporcije(this.klik1Y, this.visinaHTML, this.visinaAng),
        'black',
        'orange'
      );
    }
  }

  klikni(canvas: HTMLCanvasElement, event: any) {
    if ((<MouseEvent>event).button != 0) return;
    const rect = canvas.getBoundingClientRect();
    let ex = parseInt(event.clientX.toString());
    let ey = parseInt(event.clientY.toString());
    let cx = parseInt(rect.left.toString());
    let cy = parseInt(rect.top.toString());
    let x = this.proporcije(ex - cx, this.sirinaAng, this.sirinaHTML);
    let y = this.proporcije(ey - cy, this.visinaAng, this.visinaHTML);
    if (this.mod == 1) {
      let izabranSto = this.proveriKliknutoNaKrug(x, y, this.raspored.stolovi);
      if (izabranSto >= 0) {
        let testRaspored = JSON.parse(JSON.stringify(this.raspored));
        testRaspored.stolovi.splice(izabranSto, 1);
        this.raspored = testRaspored;
        this.klik1X = -1;
        this.klik1Y = -1;
        this.nacrtajCanvas();
        this.rasporedNaziv = '* Nacrtano na Canvas-u *';
      }
      let izabranaKuhinja = this.proveriKliknutoNaKvadrat(
        x,
        y,
        this.raspored.kuhinje
      );
      if (izabranaKuhinja >= 0) {
        let testRaspored = JSON.parse(JSON.stringify(this.raspored));
        testRaspored.kuhinje.splice(izabranaKuhinja, 1);
        this.raspored = testRaspored;
        this.nacrtajCanvas();
        this.rasporedNaziv = '* Nacrtano na Canvas-u *';
      }
      let izabranToalet = this.proveriKliknutoNaKvadrat(
        x,
        y,
        this.raspored.toaleti
      );
      if (izabranToalet >= 0) {
        let testRaspored = JSON.parse(JSON.stringify(this.raspored));
        testRaspored.toaleti.splice(izabranToalet, 1);
        this.raspored = testRaspored;
        this.nacrtajCanvas();
        this.rasporedNaziv = '* Nacrtano na Canvas-u *';
      }
    } else {
      if (
        this.proveriKliknutoNaKrug(x, y, this.raspored.stolovi) > -1 ||
        this.proveriKliknutoNaKvadrat(x, y, this.raspored.toaleti) > -1 ||
        this.proveriKliknutoNaKvadrat(x, y, this.raspored.kuhinje) > -1
      ) {
        this.klik1X = -1;
        this.klik1Y = -1;
        this.nacrtajCanvas();
        return;
      }
      if (this.klik1X == -1) {
        this.klik1X = x;
        this.klik1Y = y;
        this.nacrtajCanvas();
      } else {
        if ((this.klik1X == x || this.klik1Y == y) && this.oblik != 0) {
          this.klik1X = -1;
          this.klik1Y = -1;
          this.nacrtajCanvas();
          return;
        }
        let testRaspored = JSON.parse(JSON.stringify(this.raspored));
        switch (this.oblik) {
          case 0:
            testRaspored.stolovi.push({
              x: this.klik1X,
              y: this.klik1Y,
              r: Math.ceil(Math.hypot(x - this.klik1X, y - this.klik1Y)),
              kap: this.kapacitet,
            });
            break;
          default:
            let x1 = x < this.klik1X ? x : this.klik1X;
            let y1 = y < this.klik1Y ? y : this.klik1Y;
            let x2 = x > this.klik1X ? x : this.klik1X;
            let y2 = y > this.klik1Y ? y : this.klik1Y;
            if (this.oblik == 1)
              testRaspored.kuhinje.push({ x1: x1, y1: y1, x2: x2, y2: y2 });
            else testRaspored.toaleti.push({ x1: x1, y1: y1, x2: x2, y2: y2 });
        }
        if (
          this.proveriPreklapanja(testRaspored) == 1 &&
          this.proveriDimenzije(testRaspored) == 1
        ) {
          this.raspored = testRaspored;
          this.rasporedNaziv = '* Nacrtano na Canvas-u *';
        }
        this.klik1X = -1;
        this.klik1Y = -1;
        this.nacrtajCanvas();
      }
    }
  }

  proveriKliknutoNaKrug(x: number, y: number, krugovi: Krug[]) {
    for (let i = 0; i < krugovi.length; i++) {
      if (Math.hypot(krugovi[i].x - x, krugovi[i].y - y) <= krugovi[i].r)
        return i;
    }
    return -1;
  }

  proveriKliknutoNaKvadrat(x: number, y: number, kvadrati: Kvadrat[]) {
    for (let i = 0; i < kvadrati.length; i++) {
      if (
        kvadrati[i].x1 <= x &&
        x <= kvadrati[i].x2 &&
        kvadrati[i].y1 <= y &&
        y <= kvadrati[i].y2
      )
        return i;
    }
    return -1;
  }

  pretvoriJSONuRaspored(jsonTekst: string) {
    let regexTekst =
      '^{' +
      '("visina":[1-9][0-9]{0,3},)?' +
      '("sirina":[1-9][0-9]{0,3},)?' +
      '"stolovi":\\[' +
      '(' +
      '{"x":[1-9][0-9]{0,3},"y":[1-9][0-9]{0,3},"r":[1-9][0-9]{0,3},"kap":[1-9][0-9]{0,3}}' +
      '(,{"x":[1-9][0-9]{0,3},"y":[1-9][0-9]{0,3},"r":[1-9][0-9]{0,3},"kap":[1-9][0-9]{0,3}})*' +
      ')?' +
      '\\],' +
      '"kuhinje":\\[' +
      '(' +
      '{"x1":[1-9][0-9]{0,3},"y1":[1-9][0-9]{0,3},"x2":[1-9][0-9]{0,3},"y2":[1-9][0-9]{0,3}}' +
      '(,{"x1":[1-9][0-9]{0,3},"y1":[1-9][0-9]{0,3},"x2":[1-9][0-9]{0,3},"y2":[1-9][0-9]{0,3}})*' +
      ')?' +
      '\\],' +
      '"toaleti":\\[' +
      '(' +
      '{"x1":[1-9][0-9]{0,3},"y1":[1-9][0-9]{0,3},"x2":[1-9][0-9]{0,3},"y2":[1-9][0-9]{0,3}}' +
      '(,{"x1":[1-9][0-9]{0,3},"y1":[1-9][0-9]{0,3},"x2":[1-9][0-9]{0,3},"y2":[1-9][0-9]{0,3}})*' +
      ')?' +
      '\\]' +
      '}$';
    if (!new RegExp(regexTekst).test(jsonTekst)) return null;
    let rezultat = <Raspored>JSON.parse(jsonTekst);
    if (rezultat.visina == undefined || rezultat.visina == 0)
      rezultat.visina = 300;
    if (rezultat.sirina == undefined || rezultat.sirina == 0)
      rezultat.sirina = 450;
    return rezultat;
  }

  proveriDimenzije(testRaspored: Raspored) {
    let lk = testRaspored.kuhinje.length;
    let lt = testRaspored.toaleti.length;
    let ls = testRaspored.stolovi.length;
    for (let i = 0; i < lk; i++) {
      let k1 = testRaspored.kuhinje[i];
      if (k1.x1 <= 0 || k1.x2 >= testRaspored.sirina) return -4;
      if (k1.y1 <= 0 || k1.y2 >= testRaspored.visina) return -4;
    }
    for (let i = 0; i < lt; i++) {
      let t1 = testRaspored.toaleti[i];
      if (t1.x1 <= 0 || t1.x2 >= testRaspored.sirina) return -4;
      if (t1.y1 <= 0 || t1.y2 >= testRaspored.visina) return -4;
    }
    for (let i = 0; i < ls; i++) {
      let s1 = testRaspored.stolovi[i];
      if (s1.x - s1.r <= 0 || s1.x + s1.r >= testRaspored.sirina) return -4;
      if (s1.y - s1.r <= 0 || s1.y + s1.r >= testRaspored.visina) return -4;
    }
    return 1;
  }

  proveriPreklapanja(testRaspored: Raspored) {
    let lk = testRaspored.kuhinje.length;
    let lt = testRaspored.toaleti.length;
    let ls = testRaspored.stolovi.length;
    for (let i = 0; i < lk; i++) {
      let k1 = testRaspored.kuhinje[i];
      for (let j = i + 1; j < lk; j++) {
        let k2 = testRaspored.kuhinje[j];
        if (this.preklapajuSe2Kv(k1, k2)) return -1;
      }
      for (let j = 0; j < lt; j++) {
        let t1 = testRaspored.toaleti[j];
        if (this.preklapajuSe2Kv(k1, t1)) return -1;
      }
      for (let j = 0; j < ls; j++) {
        let s1 = testRaspored.stolovi[j];
        if (this.preklapajuSeKrKv(s1, k1)) return -1;
      }
    }
    for (let i = 0; i < lt; i++) {
      let t1 = testRaspored.toaleti[i];
      for (let j = i + 1; j < lt; j++) {
        let t2 = testRaspored.toaleti[j];
        if (this.preklapajuSe2Kv(t1, t2)) return -1;
      }
      for (let j = 0; j < ls; j++) {
        let s1 = testRaspored.stolovi[j];
        if (this.preklapajuSeKrKv(s1, t1)) return -1;
      }
    }
    for (let i = 0; i < ls; i++) {
      let s1 = testRaspored.stolovi[i];
      for (let j = i + 1; j < ls; j++) {
        let s2 = testRaspored.stolovi[j];
        if (this.preklapajuSe2Kr(s1, s2)) return -1;
      }
    }
    return 1;
  }

  promeniVisinu(): void {
    this.klik1X = -1;
    this.klik1Y = -1;
    this.nacrtajCanvas();
    this.obrisiGreske();
    if (!new RegExp(/^[ ]*[1-9][0-9]*[ ]*$/).test(this.novaVisina)) {
      this.novaVisina = this.visinaAng.toString();
      return;
    }
    let vrednost = Number.parseInt(this.novaVisina);
    if (vrednost < 10 || vrednost > 999) {
      this.novaVisina = this.visinaAng.toString();
      return;
    }
    let testRaspored = JSON.parse(JSON.stringify(this.raspored));
    testRaspored.visina = vrednost;
    if (this.proveriDimenzije(testRaspored) != 1) {
      this.novaVisina = this.visinaAng.toString();
      return;
    }
    this.raspored.visina = vrednost;
    this.visinaAng = vrednost;
    this.novaVisina = this.novaVisina.trim();
    this.nacrtajCanvas();
    this.rasporedNaziv = '* Nacrtano na Canvas-u *';
  }

  promeniSirinu(): void {
    this.klik1X = -1;
    this.klik1Y = -1;
    this.nacrtajCanvas();
    this.obrisiGreske();
    if (!new RegExp(/^[ ]*[1-9][0-9]*[ ]*$/).test(this.novaSirina)) {
      this.novaSirina = this.sirinaAng.toString();
      return;
    }
    let vrednost = Number.parseInt(this.novaSirina);
    if (vrednost < 10 || vrednost > 999) {
      this.novaSirina = this.sirinaAng.toString();
      return;
    }
    let testRaspored = JSON.parse(JSON.stringify(this.raspored));
    testRaspored.sirina = vrednost;
    if (this.proveriDimenzije(testRaspored) != 1) {
      this.novaSirina = this.sirinaAng.toString();
      return;
    }
    this.raspored.sirina = vrednost;
    this.sirinaAng = vrednost;
    this.novaSirina = this.novaSirina.trim();
    this.nacrtajCanvas();
    this.rasporedNaziv = '* Nacrtano na Canvas-u *';
  }

  obrisiGreske(): void {
    this.rasporedGreska = '';
    this.formatGreske = [];
  }

  async ucitajRaspored(event: any) {
    this.obrisiGreske();
    let input = event.target;
    if (input.files && input.files[0]) {
      let fajlNaziv = input.files[0].name;
      let regex = new RegExp(/(\.txt)|(\.json)$/);
      if (!regex.test(fajlNaziv)) {
        this.rasporedGreska =
          "Raspored mora da bude fajl sa nekom od ekstenzija '.txt' ili '.json'";
        return;
      }
      let reader = new FileReader();
      reader.readAsText(input.files[0]);
      reader.onloadend = (e) => {
        let procitanTekst = '';
        let fajlTekst = '';
        if (reader.result) procitanTekst = <string>reader.result;
        for (let c of procitanTekst) {
          if (c == '\n' || c == '\r' || c == ' ' || c == '\t') continue;
          fajlTekst += c;
        }
        let testRaspored = this.pretvoriJSONuRaspored(fajlTekst);
        if (testRaspored == null) {
          this.formatGreske.push(
            'Polje "visina" je prirodan broj manji od 10000'
          );
          this.formatGreske.push(
            'Polje "sirina" je prirodan broj manji od 10000'
          );
          this.formatGreske.push(
            'Polje "stolovi" je niz objekata sa poljima "x","y","r","kap" koji su prirodni brojevi manji od 10000'
          );
          this.formatGreske.push(
            'Polje "kuhinje" je niz objekata sa poljima "x1","y1","x2","y2" koji su prirodni brojevi manji od 10000'
          );
          this.formatGreske.push(
            'Polje "toaleti" je niz objekata sa poljima "x1","y1","x2","y2" koji su prirodni brojevi manji od 10000'
          );
          this.formatGreske.push(
            'U svakom objektu sa poljima x1,x2,y1,y2 moraju da vaze relacije x1<x2 i y1<y2'
          );
          this.rasporedGreska =
            'Sadrzaj fajla mora biti JSON predstava objekta sa sledecim opcionim poljima:';
        } else if (
          this.proveriDimenzije(testRaspored) != 1 ||
          this.proveriPreklapanja(testRaspored) != 1
        ) {
          this.rasporedGreska =
            "Neki objekti se ne nalaze unutar 'dimenzija' restorana ili se medjusobno preklapaju";
        } else {
          this.raspored = testRaspored;
          this.rasporedNaziv = fajlNaziv;
          this.sirinaAng = this.raspored.sirina;
          this.visinaAng = this.raspored.visina;
          this.novaVisina = this.visinaAng.toString();
          this.novaSirina = this.sirinaAng.toString();
          this.nacrtajCanvas();
        }
      };
    }
  }

  preklapajuSeKrKv(krug: Krug, kvadrat: Kvadrat) {
    if (krug.x + krug.r < kvadrat.x1 || krug.x - krug.r > kvadrat.x2)
      return false;
    if (krug.y + krug.r < kvadrat.y1 || krug.y - krug.r > kvadrat.y2)
      return false;
    if (
      Math.ceil(Math.hypot(krug.x - kvadrat.x1, krug.y - kvadrat.y1)) <= krug.r
    )
      return true;
    if (
      Math.ceil(Math.hypot(krug.x - kvadrat.x1, krug.y - kvadrat.y2)) <= krug.r
    )
      return true;
    if (
      Math.ceil(Math.hypot(krug.x - kvadrat.x2, krug.y - kvadrat.y1)) <= krug.r
    )
      return true;
    if (
      Math.ceil(Math.hypot(krug.x - kvadrat.x2, krug.y - kvadrat.y2)) <= krug.r
    )
      return true;
    if (kvadrat.x1 <= krug.x && krug.x <= kvadrat.x2) return true;
    if (kvadrat.y1 <= krug.y && krug.y <= kvadrat.y2) return true;
    return false;
  }

  preklapajuSe2Kr(krug1: Krug, krug2: Krug) {
    if (
      Math.ceil(Math.hypot(krug1.x - krug2.x, krug1.y - krug2.y)) >
      krug1.r + krug2.r
    )
      return false;
    return true;
  }

  preklapajuSe2Kv(kvadrat1: Kvadrat, kvadrat2: Kvadrat) {
    if (kvadrat1.x2 < kvadrat2.x1 || kvadrat2.x2 < kvadrat1.x1) return false;
    if (kvadrat1.y2 < kvadrat2.y1 || kvadrat2.y2 < kvadrat1.y1) return false;
    return true;
  }

  proveriKapacitet(): void {
    this.rasporedGreska = '';
    this.formatGreske = [];
    if (!new RegExp(/^[ ]*[1-9][0-9]?[ ]*$/).test(this.noviKapacitet)) {
      this.noviKapacitet = this.kapacitet.toString();
      return;
    }
    this.kapacitet = Number.parseInt(this.noviKapacitet);
    this.noviKapacitet = this.kapacitet.toString();
  }

  proveriRaspored(testRaspored: Raspored) {
    if (testRaspored.kuhinje.length < 1) return -1;
    if (testRaspored.toaleti.length < 1) return -2;
    if (testRaspored.stolovi.length < 3) return -3;
    if (this.proveriDimenzije(testRaspored) != 1) return -4;
    if (this.proveriPreklapanja(testRaspored) != 1) return -4;
    return 1;
  }

  resetujRaspored(): void {
    this.raspored = new Raspored();
    this.rasporedNaziv = '';
    this.rasporedGreska = '';
    this.formatGreske = [];
    this.visinaAng = 300;
    this.sirinaAng = 450;
    this.raspored.visina = 300;
    this.raspored.sirina = 450;
    this.novaVisina = this.visinaAng.toString();
    this.novaSirina = this.sirinaAng.toString();
    this.nacrtajCanvas();
  }

  promeniMod(): void {
    this.mod = 1 - this.mod;
  }

  promeniElement(): void {
    this.oblik = (this.oblik + 1) % 3;
  }
}
