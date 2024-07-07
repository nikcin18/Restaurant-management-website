import { Injectable } from '@angular/core';
import { Zahtev } from '../models/Zahtev';
import { HttpClient } from '@angular/common/http';
import { Poruka } from '../models/Poruka';

@Injectable({
  providedIn: 'root',
})
export class ZahtevService {
  constructor(private http: HttpClient) {}

  host: string = 'localhost';
  baza: string = 'http://' + this.host + ':4000/zahtevi/';

  noviZahtev(zahtev: Zahtev) {
    return this.http.post<Poruka>(this.baza + '/noviZahtev', zahtev);
  }

  dohvatiNeobradjeneZahteve() {
    return this.http.get<Zahtev[]>(this.baza + '/dohvatiNeobradjeneZahteve');
  }

  dohvatiSveZahteve() {
    return this.http.get<Zahtev[]>(this.baza + '/dohvatiSveZahteve');
  }

  prihvatiZahtev(id: number) {
    return this.http.post<Zahtev[]>(this.baza + '/prihvatiZahtev', { id: id });
  }

  odbijZahtev(id: number) {
    return this.http.post<Zahtev[]>(this.baza + '/odbijZahtev', { id: id });
  }
}
