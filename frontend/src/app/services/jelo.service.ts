import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Jelo } from '../models/Jelo';
import { Poruka } from '../models/Poruka';
import { Gost } from '../models/Gost';
import { ElementKorpe } from '../models/ElementKorpe';

@Injectable({
  providedIn: 'root',
})
export class JeloService {
  constructor(private http: HttpClient) {}

  host: string = 'localhost';
  baza: string = 'http://' + this.host + ':4000/jela/';

  dohvatiJela(restoran: number) {
    return this.http.get<Jelo[]>(this.baza + '/dohvatiJela/' + restoran);
  }

  dohvatiKorpu(gost: string, restoran: number) {
    return this.http.get<ElementKorpe[]>(
      this.baza + '/dohvatiKorpu/' + gost + '/' + restoran
    );
  }

  dodajUKorpu(g: string, j: number, r: number, k: number) {
    const data = {
      gost: g,
      jelo: j,
      restoran: r,
      kolicina: k,
    };
    return this.http.post<ElementKorpe[]>(this.baza + '/dodajUKorpu/', data);
  }

  ukloniJeloIzKorpe(g: string, r: number, j: number) {
    const data = {
      gost: g,
      restoran: r,
      jelo: j,
    };
    return this.http.post<ElementKorpe[]>(
      this.baza + '/ukloniJeloIzKorpe/',
      data
    );
  }

  izmeniKolicinu(g: string, r: number, j: number, k: number) {
    const data = {
      gost: g,
      jelo: j,
      restoran: r,
      kolicina: k,
    };
    return this.http.post<ElementKorpe[]>(this.baza + '/izmeniKolicinu/', data);
  }
}
