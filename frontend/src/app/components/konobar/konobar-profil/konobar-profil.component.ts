import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Konobar } from 'src/app/models/Konobar';
import { KonobarService } from 'src/app/services/konobar.service';

@Component({
  selector: 'app-konobar-profil',
  templateUrl: './konobar-profil.component.html',
  styleUrls: ['./konobar-profil.component.css'],
})
export class KonobarProfilComponent {
  constructor(private router: Router, private kService: KonobarService) {}

  konobar: Konobar = new Konobar();

  promeniDugme: boolean[] = [];
  novaVrednost: string = '';
  novaSlika: any;
  novaSlikaNaziv: string = '';
  promenjenaSlika: number = 0;
  greska: string = '';

  ngOnInit(): void {
    let ss_konobar = sessionStorage.getItem('konobar');
    if (ss_konobar) {
      this.konobar = JSON.parse(ss_konobar);
      for (let i = 0; i < 7; i++) this.promeniDugme.push(true);
    }
  }

  pokreniAzuriranje(id: number) {
    this.greska = this.novaVrednost = '';
    this.novaSlika = this.konobar.slika;
    this.promenjenaSlika = 0;
    for (let i = 0; i < 7; i++) this.promeniDugme[i] = true;
    this.promeniDugme[id] = false;
    switch (id) {
      case 1:
        this.novaVrednost = this.konobar.ime;
        break;
      case 2:
        this.novaVrednost = this.konobar.prezime;
        break;
      case 3:
        this.novaVrednost = this.konobar.adresa;
        break;
      case 4:
        this.novaVrednost = this.konobar.imejl;
        break;
      case 5:
        this.novaVrednost = this.konobar.telefon;
        break;
      default:
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
    this.novaSlika = '';
    this.novaSlikaNaziv = '';
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
    let kopija = Object.assign({}, this.konobar);
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
      default:
    }
    if (this.greska == '') {
      this.kService.azurirajNalog(kopija).subscribe((data) => {
        if (data) {
          this.konobar = data;
          sessionStorage.setItem('konobar', JSON.stringify(data));
        }
        this.promenjenaSlika = 0;
        this.novaSlika = this.novaSlikaNaziv = this.novaVrednost = '';
        this.promeniDugme[id] = true;
        if (id == 0) {
          const currentRoute = this.router.url;
          this.router
            .navigateByUrl('/', { skipLocationChange: true })
            .then(() => {
              this.router.navigate([currentRoute]);
            });
        }
      });
    }
  }

  promeniImejl(): void {
    this.greska = '';
    if (!RegExp(/^[A-Za-z0-9\._]+@[A-Za-z0-9\._]+$/).test(this.novaVrednost)) {
      this.greska = "Imejl adresa mora biti u formatu 'prvi_deo@drugi_deo'";
      return;
    }
    this.kService
      .promeniImejl(this.konobar.kor_ime, this.novaVrednost)
      .subscribe((data) => {
        if (data == null || data.poruka == 'greska') {
          this.greska = 'Greska pri radu sa bazom';
        } else if (data.poruka == 'duplikat') {
          this.greska = 'Vec postoji korisnik sa istom imejl adresom';
        } else if (data.poruka == 'ne postoji') {
          this.greska = 'Ne postoji korisnik';
        } else {
          this.konobar.imejl = data.poruka;
          sessionStorage.setItem('konobar', JSON.stringify(this.konobar));
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
}
