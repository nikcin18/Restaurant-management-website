import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gost } from '../models/Gost';
import { Zahtev } from '../models/Zahtev';
import { Poruka } from '../models/Poruka';

@Injectable({
  providedIn: 'root',
})
export class GostService {
  constructor(private http: HttpClient) {}

  host: string = 'localhost';
  baza: string = 'http://' + this.host + ':4000/gosti/';

  login(kor_imeP: string, lozinkaP: string) {
    const data = {
      kor_ime: kor_imeP,
      lozinka: lozinkaP,
    };
    return this.http.post<Gost>(this.baza + '/login', data);
  }

  dohvatiGosta(kor_ime: string) {
    return this.http.get<Gost>(this.baza + '/dohvatiGosta/' + kor_ime);
  }

  registracija(zahtev: Zahtev) {
    return this.http.post<Poruka>(this.baza + '/registracija', zahtev);
  }

  dohvatiSveGoste() {
    return this.http.get<Gost[]>(this.baza + '/dohvatiSveGoste');
  }

  dohvatiBrojGostiju() {
    return this.http.get<number>(this.baza + '/dohvatiBrojGostiju');
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

  azurirajNalog(g: Gost) {
    return this.http.post<Gost>(this.baza + '/azurirajNalog', g);
  }

  blokirajGosta(kor_ime: string) {
    return this.http.post<Poruka>(this.baza + '/blokirajGosta', {
      kor_ime: kor_ime,
    });
  }

  odblokirajGosta(kor_ime: string) {
    return this.http.post<Poruka>(this.baza + '/odblokirajGosta', {
      kor_ime: kor_ime,
    });
  }

  aktivirajGosta(kor_ime: string) {
    return this.http.post<Poruka>(this.baza + '/aktivirajGosta', {
      kor_ime: kor_ime,
    });
  }

  deaktivirajGosta(kor_ime: string) {
    return this.http.post<Poruka>(this.baza + '/deaktivirajGosta', {
      kor_ime: kor_ime,
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
