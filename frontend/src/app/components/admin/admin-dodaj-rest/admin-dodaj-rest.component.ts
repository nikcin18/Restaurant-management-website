import { Component, OnInit, ViewChild } from '@angular/core';
import { Krug } from 'src/app/models/Krug';
import { Kvadrat } from 'src/app/models/Kvadrat';
import { Poruka } from 'src/app/models/Poruka';
import { Raspored } from 'src/app/models/Raspored';
import { Restoran } from 'src/app/models/Restoran';
import { RestoranService } from 'src/app/services/restoran.service';
import { AdminRasporedComponent } from '../admin-raspored/admin-raspored.component';
import { AdminRadnoVremeComponent } from '../admin-radno-vreme/admin-radno-vreme.component';

@Component({
  selector: 'app-admin-dodaj-rest',
  templateUrl: './admin-dodaj-rest.component.html',
  styleUrls: ['./admin-dodaj-rest.component.css'],
})
export class AdminDodajRestComponent implements OnInit {
  constructor(private restService: RestoranService) {}
  @ViewChild(AdminRasporedComponent)
  adminRasporedComponent!: AdminRasporedComponent;
  @ViewChild(AdminRadnoVremeComponent)
  adminRadnoVremeComponent!: AdminRadnoVremeComponent;

  naziv: string = '';
  tip: string = '';
  opis: string = '';
  adresa: string = '';
  kontakt: string = '';

  praznaPolja: boolean = false;
  losiFormati: boolean = false;
  greskaPoruke: string[] = [];
  poruka:string="";

  ngOnInit(): void {}

  potvrdi(): void {
    this.greskaPoruke = [];
    this.poruka="";
    this.adminRasporedComponent.obrisiGreske();
    this.losiFormati = false;
    this.praznaPolja = false;
    if (this.naziv == '') {
      if (!this.praznaPolja) {
        this.praznaPolja = true;
        this.greskaPoruke.push('Greska: Postoje prazna polja!!!');
      }
      this.greskaPoruke.push("Niste popunili polje 'Naziv'");
    }
    if (this.tip == '') {
      if (!this.praznaPolja) {
        this.praznaPolja = true;
        this.greskaPoruke.push('Greska: Postoje prazna polja!!!');
      }
      this.greskaPoruke.push("Niste popunili polje 'Tip'");
    }
    if (this.adresa == '') {
      if (!this.praznaPolja) {
        this.praznaPolja = true;
        this.greskaPoruke.push('Greska: Postoje prazna polja!!!');
      }
      this.greskaPoruke.push("Niste popunili polje 'Adresa'");
    }
    if (this.opis == '') {
      if (!this.praznaPolja) {
        this.praznaPolja = true;
        this.greskaPoruke.push('Greska: Postoje prazna polja!!!');
      }
      this.greskaPoruke.push("Niste popunili polje 'Opis'");
    }
    if (this.kontakt == '') {
      if (!this.praznaPolja) {
        this.praznaPolja = true;
        this.greskaPoruke.push('Greska: Postoje prazna polja!!!');
      }
      this.greskaPoruke.push("Niste popunili polje 'Bezbedonosno pitanje'");
    }
    let rasporedNaziv = this.adminRasporedComponent.dohvatiNaziv();
    if (rasporedNaziv === '') {
      if (!this.praznaPolja) {
        this.praznaPolja = true;
        this.greskaPoruke.push('Greska: Postoje prazna polja!!!');
      }
      this.greskaPoruke.push("Niste popunili polje 'Raspored'");
    }
    if (this.adminRadnoVremeComponent.praznoRadnoVreme()) {
      if (!this.praznaPolja) {
        this.praznaPolja = true;
        this.greskaPoruke.push('Greska: Postoje prazna polja!!!');
      }
      this.greskaPoruke.push('Neka polja u radnom vremenu nisu popunjena');
    }
    if (this.praznaPolja) return;
    if (this.adminRadnoVremeComponent.loseRadnoVreme()) {
      if (!this.losiFormati) {
        this.losiFormati = true;
        this.greskaPoruke.push(
          'Greska: Uneti podaci ne zadovoljavaju zahtevane formate!!!'
        );
      }
      this.greskaPoruke.push(
        'Intervali radnog vremena moraju biti duzi od 0 minuta i medjusodno disjunktni i' +
          'i moraju biti sortirani od najranijeg do najkasnijeg'
      );
    }
    if (this.losiFormati) return;
    let rasporedGreska = this.adminRasporedComponent.dohvatiGresku();
    if (rasporedGreska.length > 0) {
      if (!this.losiFormati) {
        this.losiFormati = true;
        this.greskaPoruke.push(
          'Greska: Uneti podaci ne zadovoljavaju zahtevane formate!!!'
        );
      }
      this.greskaPoruke.push(rasporedGreska);
    }
    if (this.losiFormati == true) return;
    let restoran = new Restoran();
    restoran.naziv = this.naziv;
    restoran.tip = this.tip;
    restoran.adresa = this.adresa;
    restoran.opis = this.opis;
    restoran.kontakt = this.kontakt;
    restoran.raspored = this.adminRasporedComponent.dohvatiRaspored();
    restoran.radno_vreme = this.adminRadnoVremeComponent.dohvatiRadnoVreme();
    this.restService.dodajRestoran(restoran).subscribe((data: Poruka) => {
      if (data.poruka=="ok") this.poruka="Restoran je uspesno dodat";
      else this.greskaPoruke.push(data.poruka);
    });
  }
}
