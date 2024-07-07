import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ElementKorpe } from 'src/app/models/ElementKorpe';
import { Gost } from 'src/app/models/Gost';
import { Restoran } from 'src/app/models/Restoran';
import { DostavaService } from 'src/app/services/dostava.service';
import { JeloService } from 'src/app/services/jelo.service';
import { RestoranService } from 'src/app/services/restoran.service';

@Component({
  selector: 'app-gost-korpa',
  templateUrl: './gost-korpa.component.html',
  styleUrls: ['./gost-korpa.component.css'],
})
export class GostKorpaComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private restService: RestoranService,
    private jService: JeloService,
    private dService: DostavaService
  ) {}
  gost: Gost = new Gost();
  restoran: Restoran = new Restoran();
  korpa: ElementKorpe[] = [];
  kolicine: string[] = [];
  greske: string[] = [];
  greska: string = '';
  poruka: string = '';
  cena: number = 0;

  ngOnInit(): void {
    let ss_gost = sessionStorage.getItem('gost');
    if (ss_gost != null) {
      this.gost = JSON.parse(ss_gost);
    }
    let qp_restoran = this.route.snapshot.queryParams['restoran'];
    if (qp_restoran == null) this.router.navigate(['gosti/restorani']);
    this.restService.dohvatiRestoranId(qp_restoran).subscribe((data) => {
      if (data) {
        this.restoran = data;
        this.jService
          .dohvatiKorpu(this.gost.kor_ime, this.restoran.id)
          .subscribe((data) => {
            if (data) {
              this.korpa = data;
              this.cena = 0;
              this.kolicine = [];
              for (let j of this.korpa) {
                this.cena += j.cena * j.kolicina;
                this.kolicine.push('');
              }
            } else
              this.router.navigate(['gosti/restorani'], {
                queryParams: { restoran: this.restoran.id },
              });
          });
      } else this.router.navigate(['gosti/restorani']);
    });
  }

  nazad(): void {
    this.router.navigate(['gosti/restorani/info'], {
      queryParams: { restoran: this.restoran.id },
    });
  }

  promeniKolicinu(ind: number) {
    this.greska = '';
    for (let i = 0; i < this.korpa.length; i++) {
      if (i != ind) this.kolicine[i] = '';
      this.greske[i] = '';
    }
    if (
      !new RegExp(/^[ ]*[-]?[0-9]+(\.[0-9]+)?[ ]*$/).test(this.kolicine[ind])
    ) {
      this.greske[ind] = 'Los format kolicine';
      return;
    } else {
      let kolicina = Number.parseFloat(this.kolicine[ind]);
      if (kolicina <= 0) {
        this.greske[ind] = 'Kolicina mora da bude pozitivan broj';
        return;
      }
      if (kolicina > 100) {
        this.greske[ind] = 'Kolicina je suvise velika';
        return;
      }
      kolicina = Math.floor(kolicina * 1000) / 1000;
      if (kolicina <= 0) {
        this.greske[ind] = 'Kolicina je suvise mala';
        return;
      }
      this.jService
        .izmeniKolicinu(
          this.gost.kor_ime,
          this.restoran.id,
          this.korpa[ind].jelo,
          kolicina
        )
        .subscribe((data) => {
          if (data) {
            this.korpa = data;
            this.cena = 0;
            this.kolicine = [];
            for (let j of this.korpa) {
              this.cena += j.cena * j.kolicina;
              this.kolicine.push('');
            }
          } else this.greska = 'Greska pri promeni kolicine jela';
        });
    }
  }

  ukloniJelo(ind: number) {
    this.greska = '';
    for (let i = 0; i < this.korpa.length; i++) {
      this.greske[i] = '';
    }
    this.jService
      .ukloniJeloIzKorpe(
        this.gost.kor_ime,
        this.restoran.id,
        this.korpa[ind].jelo
      )
      .subscribe((data) => {
        if (data) {
          this.korpa = data;
          this.cena = 0;
          this.kolicine = [];
          for (let j of this.korpa) {
            this.cena += j.cena * j.kolicina;
            this.kolicine.push('');
          }
        } else this.greska = 'Greska pri brisanju jela iz korpe';
      });
  }

  naruci(): void {
    this.greska = '';
    /*if(this.korpa.length==0){
      this.greska="Ne mozete naruciti praznu korpu";
      return ;
    }*/
    let sadrzaj = <string[]>[];
    for (let jelo of this.korpa) {
      sadrzaj.push(jelo.naziv + ' (' + jelo.kolicina + ' kg/L)');
    }
    this.dService
      .naruciKorpu(
        this.gost.kor_ime,
        this.restoran.id,
        this.restoran.naziv,
        sadrzaj,
        this.cena
      )
      .subscribe((data) => {
        if (data.poruka == 'ok') {
          this.korpa = [];
          this.poruka = 'Narudzbina je poslata';
        } else {
          this.greska = data.poruka;
        }
      });
  }

  range(a: number, b: number) {
    let arr = <number[]>[];
    for (let i = a; i < b; i++) {
      arr.push(i);
    }
    return arr;
  }
}
