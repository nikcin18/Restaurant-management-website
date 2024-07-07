import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Admin } from '../models/Admin';
import { Poruka } from '../models/Poruka';
import { Konobar } from '../models/Konobar';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private http: HttpClient) {}

  host: string = 'localhost';
  baza: string = 'http://' + this.host + ':4000/administratori/';

  login(kor_imeP: string, lozinkaP: string) {
    const data = {
      kor_ime: kor_imeP,
      lozinka: lozinkaP,
    };
    return this.http.post<Admin>(this.baza + '/login', data);
  }

  promeniLozinku(k: string, sl: string, nl: string) {
    const data = {
      kor_ime: k,
      stara_lozinka: sl,
      nova_lozinka: nl,
    };
    return this.http.post<Poruka>(this.baza + '/promeniLozinku', data);
  }

  zahtevKonobar(konobar: Konobar) {
    return this.http.post<Poruka>(this.baza + '/zahtevKonobar', konobar);
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
