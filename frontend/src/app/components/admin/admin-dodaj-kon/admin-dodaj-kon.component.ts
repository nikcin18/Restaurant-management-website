import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Konobar } from 'src/app/models/Konobar';
import { Poruka } from 'src/app/models/Poruka';
import { AdminService } from 'src/app/services/admin.service';
import { RestoranService } from 'src/app/services/restoran.service';

@Component({
  selector: 'app-admin-dodaj-kon',
  templateUrl: './admin-dodaj-kon.component.html',
  styleUrls: ['./admin-dodaj-kon.component.css'],
})
export class AdminDodajKonComponent {
  constructor(
    private aService: AdminService,
    private restService: RestoranService,
    private http: HttpClient
  ) {}

  restorani: any[] = [];

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
  restoran: string = '';
  slika: any;

  slikaNaziv: string = '';

  praznaPolja: boolean = false;
  losiFormati: boolean = false;
  greskaPoruke: string[] = [];
  poruka:string="";

  ngOnInit(): void {
    this.restService.dohvatiSveKratko().subscribe((data: any) => {
      if (data) this.restorani = data;
    });
  }

  resetujSliku() {
    this.slika = undefined;
    this.slikaNaziv = '';
    this.greskaPoruke = [];
    this.poruka="";
  }

  async ucitajSliku(event: any) {
    this.greskaPoruke = [];
    this.poruka="";
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
    this.poruka="";
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
    if (this.restoran == '') {
      if (!this.praznaPolja) {
        this.praznaPolja = true;
        this.greskaPoruke.push('Greska: Postoje prazna polja!!!');
      }
      this.greskaPoruke.push("Niste popunili polje 'Restoran'");
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
      this.greskaPoruke.push(
        "Telefon nije u dobrom formatu"
      );
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
    if (this.losiFormati) return;
    let konobar = new Konobar();
    konobar.kor_ime = this.kor_ime;
    konobar.lozinka = this.lozinka;
    konobar.bezb_pitanje = this.bezb_pitanje;
    konobar.bezb_odgovor = this.bezb_odgovor;
    konobar.ime = this.ime;
    konobar.prezime = this.prezime;
    konobar.pol = this.pol;
    konobar.adresa = this.adresa;
    konobar.telefon = this.telefon;
    konobar.imejl = this.imejl;
    konobar.restoran = Number.parseInt(this.restoran);
    if (this.slikaNaziv != '') konobar.slika = this.slika;
    else konobar.slika = '';
    this.aService.zahtevKonobar(konobar).subscribe((data: Poruka) => {
      if (data.poruka == 'ok') {
        this.poruka='Konobar uspesno dodat';
      } else {
        this.greskaPoruke.push(data.poruka);
      }
    });
  }
}
