import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Konobar } from '../models/Konobar';
import { Poruka } from '../models/Poruka';

@Injectable({
  providedIn: 'root',
})
export class KonobarService {
  constructor(private http: HttpClient) {}

  host: string = 'localhost';
  baza: string = 'http://' + this.host + ':4000/konobari/';

  login(kor_imeP: string, lozinkaP: string) {
    const data = {
      kor_ime: kor_imeP,
      lozinka: lozinkaP,
    };
    return this.http.post<Konobar>(this.baza + '/login', data);
  }

  dohvatiKonobara(kor_ime: string) {
    return this.http.get<Konobar>(this.baza + '/dohvatiKonobara/' + kor_ime);
  }

  dohvatiSveKonobare() {
    return this.http.get<Konobar[]>(this.baza + '/dohvatiSveKonobare');
  }

  promeniLozinku(k: string, sl: string, nl: string) {
    const data = {
      kor_ime: k,
      stara_lozinka: sl,
      nova_lozinka: nl,
    };
    return this.http.post<Poruka>(this.baza + '/promeniLozinku', data);
  }

  promeniImejl(kor_imeP: string, imejlP: string) {
    const data = {
      kor_ime: kor_imeP,
      imejl: imejlP,
    };
    return this.http.post<Poruka>(this.baza + '/promeniImejl', data);
  }

  azurirajNalog(k: Konobar) {
    return this.http.post<Konobar>(this.baza + '/azurirajNalog', k);
  }

  aktivirajKonobara(kor_ime: string) {
    return this.http.post<Poruka>(this.baza + '/aktivirajKonobara', {
      kor_ime: kor_ime,
    });
  }

  deaktivirajKonobara(kor_ime: string) {
    return this.http.post<Poruka>(this.baza + '/deaktivirajKonobara', {
      kor_ime: kor_ime,
    });
  }

  promeniRestoran(kor_ime: string, restoran: number) {
    return this.http.post<Poruka>(this.baza + '/promeniRestoran', {
      kor_ime: kor_ime,
      restoran: restoran,
    });
  }

  dohvatiBezbPitanje(kor_ime: string) {
    return this.http.post<Poruka>(this.baza + '/dohvatiBezbPitanje', {
      kor_ime: kor_ime,
    });
  }

  proveriBezbOdgovor(kor_ime: string, bezb_odgovor: string) {
    return this.http.post<Poruka>(this.baza + '/proveriBezbOdgovor', {
      kor_ime: kor_ime,
      bezb_odgovor: bezb_odgovor,
    });
  }

  promeniLozinkuProvereno(k: string, bo: string, nl: string) {
    const data = {
      kor_ime: k,
      bezb_odgovor: bo,
      nova_lozinka: nl,
    };
    return this.http.post<Poruka>(this.baza + '/promeniLozinkuProvereno', data);
  }
}
