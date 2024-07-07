import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Restoran } from '../models/Restoran';
import { Poruka } from '../models/Poruka';

@Injectable({
  providedIn: 'root',
})
export class RestoranService {
  constructor(private http: HttpClient) {}

  host: string = 'localhost';
  baza: string = 'http://' + this.host + ':4000/restorani/';

  dohvatiSveRestorane() {
    return this.http.get<Restoran[]>(this.baza + '/dohvatiSveRestorane');
  }

  dohvatiSveKratko() {
    return this.http.get(this.baza + '/dohvatiSveKratko');
  }

  dohvatiRestoranId(id: number) {
    return this.http.get<Restoran>(this.baza + '/dohvatiRestoranId/' + id);
  }

  pretragaRestorana(n: string, t: string, a: string) {
    return this.http.post<Restoran[]>(this.baza + '/pretragaRestorana', {
      naziv: n,
      tip: t,
      adresa: a,
    });
  }

  dodajRestoran(restoran: Restoran) {
    return this.http.post<Poruka>(this.baza + '/dodajRestoran', restoran);
  }

  dohvatiBezbPitanje(kor_ime: string) {
    return this.http.post<Poruka>(this.baza + '/dohvatiBezbPitanje', {
      kor_ime: kor_ime,
    });
  }
}
