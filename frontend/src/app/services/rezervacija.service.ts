import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Poruka } from '../models/Poruka';
import { Rezervacija } from '../models/Rezervacija';
import { Krug } from '../models/Krug';

@Injectable({
  providedIn: 'root',
})
export class RezervacijaService {
  constructor(private http: HttpClient) {}

  host: string = 'localhost';
  baza: string = 'http://' + this.host + ':4000/rezervacije';

  dohvatiStatistikuPocetna(sada: number) {
    return this.http.get<number[]>(
      this.baza + '/dohvatiStatistikuPocetna/' + sada
    );
  }

  dohvatiStatistikuDani(restoran: number, konobar: string) {
    return this.http.get<number[]>(
      this.baza +
        '/dohvatiStatistikuDani/' +
        restoran +
        '/' +
        encodeURIComponent(konobar)
    );
  }

  dohvatiStatistikuKonobari(restoran: number) {
    return this.http.get(this.baza + '/dohvatiStatistikuKonobari/' + restoran);
  }

  dohvatiStatistikuProsek(restoran: number, konobar: string) {
    return this.http.get<number[]>(
      this.baza +
        '/dohvatiStatistikuProsek/' +
        restoran +
        '/' +
        encodeURIComponent(konobar)
    );
  }

  posaljiRezervaciju1(rezervacija: Rezervacija) {
    return this.http.post<Poruka>(
      this.baza + '/posaljiRezervaciju1',
      rezervacija
    );
  }

  dohvatiRezervacijeGost(gost: string) {
    return this.http.get<Rezervacija[]>(
      this.baza + '/dohvatiRezervacijeGost/' + encodeURIComponent(gost)
    );
  }

  dohvatiNeobradjene(restoran: number) {
    return this.http.get<Rezervacija[]>(
      this.baza + '/dohvatiNeobradjene/' + restoran
    );
  }

  dohvatiPrihvacene(restoran: number, konobar: string) {
    return this.http.get<Rezervacija[]>(
      this.baza +
        '/dohvatiPrihvacene/' +
        restoran +
        '/' +
        encodeURIComponent(konobar)
    );
  }

  dohvatiZauzeteStoloveGost(
    gost: string,
    restoran: number,
    dan: number,
    pocetak: number
  ) {
    return this.http.get<number[]>(
      this.baza +
        '/dohvatiZauzeteStoloveGost/' +
        encodeURIComponent(gost) +
        '/' +
        restoran +
        '/' +
        dan +
        '/' +
        pocetak
    );
  }

  dohvatiZauzeteStoloveKonobar(restoran: number, dan: number, pocetak: number) {
    return this.http.get<number[]>(
      this.baza +
        '/dohvatiZauzeteStoloveKonobar/' +
        restoran +
        '/' +
        dan +
        '/' +
        pocetak
    );
  }

  posaljiRezervaciju2(rezervacija: Rezervacija) {
    return this.http.post<Poruka>(
      this.baza + '/posaljiRezervaciju2',
      rezervacija
    );
  }

  oceniRezervaciju(idP: number, tekstP: string, brojP: number) {
    const data = {
      id: idP,
      tekst: tekstP,
      broj: brojP,
    };
    return this.http.post<Poruka>(this.baza + '/oceniRezervaciju', data);
  }

  odbijRezervaciju(idP: number, komentarP: string) {
    const data = {
      id: idP,
      komentar: komentarP,
    };
    return this.http.post<Poruka>(this.baza + '/odbijRezervaciju', data);
  }

  prihvatiRezervaciju(idP: number, konobarP: string, stoP: number) {
    const data = {
      id: idP,
      konobar: konobarP,
      sto: stoP,
    };
    return this.http.post<Poruka>(this.baza + '/prihvatiRezervaciju', data);
  }

  otkaziRezervaciju(rezervacijaP: number, sadaP: number) {
    const data = {
      rezervacija: rezervacijaP,
      sada: sadaP,
    };
    return this.http.post<Poruka>(this.baza + '/otkaziRezervaciju', data);
  }

  posecenaRezervacija(idP: number) {
    const data = {
      id: idP,
    };
    return this.http.post<Poruka>(this.baza + '/posecenaRezervacija', data);
  }

  propustenaRezervacija(idP: number) {
    const data = {
      id: idP,
    };
    return this.http.post<Poruka>(this.baza + '/propustenaRezervacija', data);
  }

  produziRezervaciju(idP: number) {
    const data = {
      id: idP,
    };
    return this.http.post<Poruka>(this.baza + '/produziRezervaciju', data);
  }
}
