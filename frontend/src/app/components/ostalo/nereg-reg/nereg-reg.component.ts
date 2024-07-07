import { Component, OnInit } from '@angular/core';
import { GostService } from '../../../services/gost.service';
import { ZahtevService } from '../../../services/zahtev.service';
import { HttpClient } from '@angular/common/http';
import { Zahtev } from '../../../models/Zahtev';
import { Poruka } from '../../../models/Poruka';

@Component({
  selector: 'app-nereg-reg',
  templateUrl: './nereg-reg.component.html',
  styleUrls: ['./nereg-reg.component.css'],
})
export class NeregRegComponent implements OnInit {
  constructor(
    private gService: GostService,
    private zService: ZahtevService,
    private http: HttpClient
  ) {}

  kor_ime: string = '';
  lozinka: string = '';
  bezb_pitanje: string = '';
  bezb_odgovor: string = '';
  ime: string = '';
  prezime: string = '';
  pol: string = 'M';
  adresa: string = '';
  telefon: string = '';
  imejl: string = '';
  kartica: string = '';
  slika: any;

  slikaNaziv: string = '';

  praznaPolja: boolean = false;
  losiFormati: boolean = false;
  greskaPoruke: string[] = [];

  ngOnInit(): void {
    sessionStorage.clear();
  }

  resetujSliku() {
    this.slika = undefined;
    this.slikaNaziv = '';
    this.greskaPoruke = [];
  }

  async ucitajSliku(event: any) {
    this.greskaPoruke = [];
    let input = event.target;
    if (input.files && input.files[0]) {
      let name = input.files[0].name;
      let regex = new RegExp(/(\.jpg)|(\.png)|(\.jpeg)$/);
      if (!regex.test(name)) {
        this.greskaPoruke.push('Greska: nevalidna slika!!!');
        this.greskaPoruke.push(
          "Slika mora da bude fajl sa nekom od ekstenzija '.png', '.jpeg' ili '.jpg'"
        );
        return;
      }
      let slikaImg = new Image();
      slikaImg.src = URL.createObjectURL(input.files[0]);
      await slikaImg.decode();
      if (
        slikaImg.naturalWidth < 100 ||
        slikaImg.naturalHeight < 100 ||
        slikaImg.naturalWidth > 300 ||
        slikaImg.naturalHeight > 300
      ) {
        this.greskaPoruke.push('Greska: nevalidna slika!!!');
        this.greskaPoruke.push(
          'Slika mora da bude najmanje velicine 100x100px, a najvise velicine 300x300px'
        );
        return;
      }
      this.slikaNaziv = input.files[0].name;
      let reader = new FileReader();
      reader.readAsDataURL(input.files[0]);
      reader.onloadend = (e) => {
        if (reader.result) this.slika = reader.result;
      };
    }
  }

  posaljiZahtev(): void {
    this.greskaPoruke = [];
    this.losiFormati = this.praznaPolja = false;
    if (this.kor_ime == '') {
      if (!this.praznaPolja) {
        this.praznaPolja = true;
        this.greskaPoruke.push('Greska: Postoje prazna polja!!!');
      }
      this.greskaPoruke.push("Niste popunili polje 'Korisnicko ime'");
    }
    if (this.lozinka == '') {
      if (!this.praznaPolja) {
        this.praznaPolja = true;
        this.greskaPoruke.push('Greska: Postoje prazna polja!!!');
      }
      this.greskaPoruke.push("Niste popunili polje 'Lozinka'");
    }
    if (this.ime == '') {
      if (!this.praznaPolja) {
        this.praznaPolja = true;
        this.greskaPoruke.push('Greska: Postoje prazna polja!!!');
      }
      this.greskaPoruke.push("Niste popunili polje 'Ime'");
    }
    if (this.prezime == '') {
      if (!this.praznaPolja) {
        this.praznaPolja = true;
        this.greskaPoruke.push('Greska: Postoje prazna polja!!!');
      }
      this.greskaPoruke.push("Niste popunili polje 'Prezime'");
    }
    if (this.bezb_pitanje == '') {
      if (!this.praznaPolja) {
        this.praznaPolja = true;
        this.greskaPoruke.push('Greska: Postoje prazna polja!!!');
      }
      this.greskaPoruke.push("Niste popunili polje 'Bezbedonosno pitanje'");
    }
    if (this.bezb_odgovor == '') {
      if (!this.praznaPolja) {
        this.praznaPolja = true;
        this.greskaPoruke.push('Greska: Postoje prazna polja!!!');
      }
      this.greskaPoruke.push("Niste popunili polje 'Odgovor'");
    }
    if (this.adresa == '') {
      if (!this.praznaPolja) {
        this.praznaPolja = true;
        this.greskaPoruke.push('Greska: Postoje prazna polja!!!');
      }
      this.greskaPoruke.push("Niste popunili polje 'Adresa'");
    }
    if (this.telefon == '') {
      if (!this.praznaPolja) {
        this.praznaPolja = true;
        this.greskaPoruke.push('Greska: Postoje prazna polja!!!');
      }
      this.greskaPoruke.push("Niste popunili polje 'Kontakt telefon'");
    }
    if (this.imejl == '') {
      if (!this.praznaPolja) {
        this.praznaPolja = true;
        this.greskaPoruke.push('Greska: Postoje prazna polja!!!');
      }
      this.greskaPoruke.push("Niste popunili polje 'I-mejl adresa'");
    }
    if (this.kartica == '') {
      if (!this.praznaPolja) {
        this.praznaPolja = true;
        this.greskaPoruke.push('Greska: Postoje prazna polja!!!');
      }
      this.greskaPoruke.push("Niste popunili polje 'Broj kreditne kartice'");
    }
    if (this.praznaPolja) return;
    let regexL1 = new RegExp(/^.{6,10}$/);
    if (!regexL1.test(this.lozinka)) {
      if (!this.losiFormati) {
        this.losiFormati = true;
        this.greskaPoruke.push(
          'Greska: Uneti podaci ne zadovoljavaju zahtevane formate!!!'
        );
      }
      this.greskaPoruke.push(
        'Lozinka mora da bude duzine izmedju 6 i 10 karaktera'
      );
    }
    let regexL2 = new RegExp(/[0-9]/);
    if (!regexL2.test(this.lozinka)) {
      if (!this.losiFormati) {
        this.losiFormati = true;
        this.greskaPoruke.push(
          'Greska: Uneti podaci ne zadovoljavaju zahtevane formate!!!'
        );
      }
      this.greskaPoruke.push('Lozinka mora da ima u sebi bar jedan broj');
    }
    let regexL3 = new RegExp(/[A-Z]/);
    if (!regexL3.test(this.lozinka)) {
      if (!this.losiFormati) {
        this.losiFormati = true;
        this.greskaPoruke.push(
          'Greska: Uneti podaci ne zadovoljavaju zahtevane formate!!!'
        );
      }
      this.greskaPoruke.push(
        'Lozinka mora da ima u sebi bar jedno veliko slovo'
      );
    }
    let regexL4 = new RegExp(/([a-z](.)*){3}/);
    if (!regexL4.test(this.lozinka)) {
      if (!this.losiFormati) {
        this.losiFormati = true;
        this.greskaPoruke.push(
          'Greska: Uneti podaci ne zadovoljavaju zahtevane formate!!!'
        );
      }
      this.greskaPoruke.push('Lozinka mora da ima u sebi bar tri mala slova');
    }
    let regexL5 = new RegExp(/^[a-zA-Z]/);
    if (!regexL5.test(this.lozinka)) {
      if (!this.losiFormati) {
        this.losiFormati = true;
        this.greskaPoruke.push(
          'Greska: Uneti podaci ne zadovoljavaju zahtevane formate!!!'
        );
      }
      this.greskaPoruke.push('Lozinka mora da pocinje slovom');
    }
    let regexL6 = new RegExp(/[^a-zA-Z0-9]+/);
    if (!regexL6.test(this.lozinka)) {
      if (!this.losiFormati) {
        this.losiFormati = true;
        this.greskaPoruke.push(
          'Greska: Uneti podaci ne zadovoljavaju zahtevane formate!!!'
        );
      }
      this.greskaPoruke.push(
        'Lozinka mora da ima u sebi bar jedan specijalan karakter'
      );
    }
    let regexT = new RegExp(/^[\+]?[0-9]+$/);
    if (!regexT.test(this.telefon)) {
      if (!this.losiFormati) {
        this.losiFormati = true;
        this.greskaPoruke.push(
          'Greska: Uneti podaci ne zadovoljavaju zahtevane formate!!!'
        );
      }
      this.greskaPoruke.push('Kontakt telefon nije u dobrom formatu');
    }
    let regexIm = new RegExp(/^[A-Za-z0-9\._]+@[A-Za-z0-9\._]+$/);
    if (!regexIm.test(this.imejl)) {
      if (!this.losiFormati) {
        this.losiFormati = true;
        this.greskaPoruke.push(
          'Greska: Uneti podaci ne zadovoljavaju zahtevane formate!!!'
        );
      }
      this.greskaPoruke.push(
        "Imejl adresa mora biti u formatu 'prvi_deo@drugi_deo'"
      );
    }
    let regexK = new RegExp(/^[0-9]{16}$/);
    if (!regexK.test(this.kartica)) {
      if (!this.losiFormati) {
        this.losiFormati = true;
        this.greskaPoruke.push(
          'Greska: Uneti podaci ne zadovoljavaju zahtevane formate!!!'
        );
      }
      this.greskaPoruke.push(
        'Broj kartice mora da se sastoji od tacno 16 cifara'
      );
    }
    if (this.losiFormati) return;
    let zahtev = new Zahtev();
    zahtev.kor_ime = this.kor_ime;
    zahtev.lozinka = this.lozinka;
    zahtev.bezb_pitanje = this.bezb_pitanje;
    zahtev.bezb_odgovor = this.bezb_odgovor;
    zahtev.ime = this.ime;
    zahtev.prezime = this.prezime;
    zahtev.pol = this.pol;
    zahtev.adresa = this.adresa;
    zahtev.telefon = this.telefon;
    zahtev.imejl = this.imejl;
    if (this.slikaNaziv != '') zahtev.slika = this.slika;
    else zahtev.slika = '';
    zahtev.kartica = this.kartica;
    this.zService.noviZahtev(zahtev).subscribe((data: Poruka) => {
      if (data.poruka == 'ok') {
        alert('Registracija je uspela :)');
      } else {
        alert(data.poruka);
      }
    });
  }
}
