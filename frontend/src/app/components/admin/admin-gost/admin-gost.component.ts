import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Gost } from 'src/app/models/Gost';
import { GostService } from 'src/app/services/gost.service';

@Component({
  selector: 'app-admin-gost',
  templateUrl: './admin-gost.component.html',
  styleUrls: ['./admin-gost.component.css'],
})
export class AdminGostComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private gService: GostService
  ) { }

  gost: Gost = new Gost();

  promeniDugme: boolean[] = [];
  novaVrednost: string = '';
  novaSlika: any;
  novaSlikaNaziv: string = '';
  promenjenaSlika: number = 0;
  greska: string = '';

  ngOnInit(): void {
    let qp_gost = this.route.snapshot.queryParams['kor_ime'];
    if (qp_gost == null || qp_gost == '') {
      this.router.navigate(['admin/pregled']);
    } else
      this.gService.dohvatiGosta(qp_gost).subscribe((data) => {
        if (data) this.gost = data;
        else this.router.navigate(['admin/pregled']);
        this.promeniDugme = [];
        for (let i = 0; i < 7; i++) this.promeniDugme.push(true);
      });
  }

  pokreniAzuriranje(id: number) {
    this.greska = this.novaSlika = this.novaSlikaNaziv = '';
    this.promenjenaSlika = 0;
    for (let i = 0; i < 7; i++) this.promeniDugme[i] = true;
    this.promeniDugme[id] = false;
    switch (id) {
      case 1:
        this.novaVrednost = this.gost.ime;
        break;
      case 2:
        this.novaVrednost = this.gost.prezime;
        break;
      case 3:
        this.novaVrednost = this.gost.adresa;
        break;
      case 4:
        this.novaVrednost = this.gost.imejl;
        break;
      case 5:
        this.novaVrednost = this.gost.telefon;
        break;
      default:
        this.novaVrednost = '';
    }
  }

  async ucitajSliku(event: any) {
    this.greska = '';
    let input = event.target;
    if (input.files && input.files[0]) {
      let name = input.files[0].name;
      let regex = new RegExp(/(\.jpg)|(\.png)|(\.jpeg)$/);
      if (!regex.test(name)) {
        this.greska =
          "Slika mora da bude fajl sa nekom od ekstenzija '.png', '.jpeg' ili '.jpg'";
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
        this.greska =
          'Slika mora da bude najmanje velicine 100x100px, a najvise velicine 300x300px';
        return;
      }
      this.novaSlikaNaziv = input.files[0].name;
      this.promenjenaSlika = 1;
      let reader = new FileReader();
      reader.readAsDataURL(input.files[0]);
      reader.onloadend = (e) => {
        if (reader.result) this.novaSlika = reader.result;
      };
    }
  }

  izbrisiSliku() {
    this.novaSlika = this.novaSlikaNaziv = '';
    this.greska = '';
    this.promenjenaSlika = 2;
  }

  potvrdiAzuriranje(id: number) {
    this.greska = '';
    if (this.promenjenaSlika == 0 && id == 0) {
      this.greska = 'Morate da ucitate novu ili izbrisete staru sliku';
      return;
    }
    if (this.novaVrednost == '' && id > 0) {
      this.greska = 'Morate da popunite polje';
      return;
    }
    let kopija = Object.assign({}, this.gost);
    switch (id) {
      case 0:
        kopija.slika = this.novaSlika;
        break;
      case 1:
        kopija.ime = this.novaVrednost;
        break;
      case 2:
        kopija.prezime = this.novaVrednost;
        break;
      case 3:
        kopija.adresa = this.novaVrednost;
        break;
      case 5:
        if (!RegExp(/^[\+]?[0-9]+$/).test(this.novaVrednost)) {
          this.greska =
            "Telefon nije u dobrom formatu";
          return;
        }
        kopija.telefon = this.novaVrednost;
        break;
      case 6:
        if (!RegExp(/^[0-9]{16}$/).test(this.novaVrednost)) {
          this.greska = 'Broj kartice mora da se sastoji od tacno 16 cifara';
          return;
        }
        kopija.kartica = this.novaVrednost;
        break;
      default:
    }
    if (this.greska == '') {
      this.gService.azurirajNalog(kopija).subscribe((data) => {
        if (data) {
          this.gost = data;
          this.promenjenaSlika = 0;
          this.novaSlika = this.novaSlikaNaziv = this.novaVrednost = '';
          this.promeniDugme[id] = true;
        } else {
          this.greska = 'Greska pri azuriranju naloga';
        }
      });
    }
  }

  promeniImejl(): void {
    if (!RegExp(/^[A-Za-z0-9\._]+@[A-Za-z0-9\._]+$/).test(this.novaVrednost)) {
      this.greska = "Imejl adresa mora biti u formatu 'prvi_deo@drugi_deo'";
      return;
    }
    this.gService
      .promeniImejl(this.gost.kor_ime, this.novaVrednost)
      .subscribe((data) => {
        if (data == null || data.poruka == 'greska') {
          this.greska = 'Greska pri radu sa bazom';
        } else if (data.poruka == 'duplikat') {
          this.greska = 'Vec postoji korisnik sa istom imejl adresom';
        } else if (data.poruka == 'ne postoji') {
          this.greska = 'Ne postoji korisnik';
        } else {
          this.gost.imejl = data.poruka;
          this.promeniDugme[4] = true;
          this.novaVrednost = '';
        }
      });
  }

  otkaziAzuriranje(id: number) {
    this.greska = '';
    this.novaVrednost = this.novaSlika = this.novaSlikaNaziv = '';
    this.promenjenaSlika = 0;
    this.promeniDugme[id] = true;
  }

  blokiraj() {
    this.gService.blokirajGosta(this.gost.kor_ime).subscribe((data) => {
      //alert(data.poruka);
      this.ngOnInit();
    });
  }

  odblokiraj() {
    this.gService.odblokirajGosta(this.gost.kor_ime).subscribe((data) => {
      //alert(data.poruka);
      this.ngOnInit();
    });
  }

  aktiviraj() {
    this.gService.aktivirajGosta(this.gost.kor_ime).subscribe((data) => {
      //alert(data.poruka);
      this.ngOnInit();
    });
  }

  deaktiviraj() {
    this.gService.deaktivirajGosta(this.gost.kor_ime).subscribe((data) => {
      //alert(data.poruka);
      this.ngOnInit();
    });
  }

  nazad() {
    this.router.navigate(['admin/pregled']);
  }
}
