import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { GostService } from 'src/app/services/gost.service';
import { KonobarService } from 'src/app/services/konobar.service';

@Component({
  selector: 'app-promeni-lozinku',
  templateUrl: './promeni-lozinku.component.html',
  styleUrls: ['./promeni-lozinku.component.css'],
})
export class PromeniLozinkuComponent implements OnInit {
  constructor(
    private gService: GostService,
    private kService: KonobarService,
    private aService: AdminService,
    private router: Router
  ) {}

  mod: number = 0;
  kor_ime: string = '';
  stara_lozinka: string = '';
  nova_lozinka1: string = '';
  nova_lozinka2: string = '';
  bezb_pitanje: string = '';
  bezb_odgovor: string = '';
  greskaPoruke: string[] = [];

  ngOnInit(): void {}

  proveriFormat(lozinka: string) {
    let regexL1 = new RegExp(/^.{6,10}$/);
    let ok = true;
    if (!regexL1.test(lozinka)) {
      if (ok) {
        ok = false;
        this.greskaPoruke.push(
          'Greska: Uneti podaci ne zadovoljavaju zahtevane formate!!!'
        );
      }
      this.greskaPoruke.push(
        'Lozinka mora da bude duzine izmedju 6 i 10 karaktera'
      );
    }
    let regexL2 = new RegExp(/[0-9]/);
    if (!regexL2.test(lozinka)) {
      if (ok) {
        ok = false;
        this.greskaPoruke.push(
          'Greska: Uneti podaci ne zadovoljavaju zahtevane formate!!!'
        );
      }
      this.greskaPoruke.push('Lozinka mora da ima u sebi bar jedan broj');
    }
    let regexL3 = new RegExp(/[A-Z]/);
    if (!regexL3.test(lozinka)) {
      if (ok) {
        ok = false;
        this.greskaPoruke.push(
          'Greska: Uneti podaci ne zadovoljavaju zahtevane formate!!!'
        );
      }
      this.greskaPoruke.push(
        'Lozinka mora da ima u sebi bar jedno veliko slovo'
      );
    }
    let regexL4 = new RegExp(/([a-z](.)*){3}/);
    if (!regexL4.test(lozinka)) {
      if (ok) {
        ok = false;
        this.greskaPoruke.push(
          'Greska: Uneti podaci ne zadovoljavaju zahtevane formate!!!'
        );
      }
      this.greskaPoruke.push('Lozinka mora da ima u sebi bar tri mala slova');
    }
    let regexL5 = new RegExp(/^[a-zA-Z]/);
    if (!regexL5.test(lozinka)) {
      if (ok) {
        ok = false;
        this.greskaPoruke.push(
          'Greska: Uneti podaci ne zadovoljavaju zahtevane formate!!!'
        );
      }
      this.greskaPoruke.push('Lozinka mora da pocinje slovom');
    }
    let regexL6 = new RegExp(/[^a-zA-Z0-9]+/);
    if (!regexL6.test(lozinka)) {
      if (ok) {
        ok = false;
        this.greskaPoruke.push(
          'Greska: Uneti podaci ne zadovoljavaju zahtevane formate!!!'
        );
      }
      this.greskaPoruke.push(
        'Lozinka mora da ima u sebi bar jedan specijalan karakter'
      );
    }
    return ok;
  }

  promeniLozinku(): void {
    this.greskaPoruke = [];
    if (this.kor_ime == '')
      this.greskaPoruke.push('Morate da unesete korisnicko ime');
    if (this.stara_lozinka == '')
      this.greskaPoruke.push('Morate da unesete staru lozinku');
    if (this.nova_lozinka1 == '' || this.nova_lozinka2 == '')
      this.greskaPoruke.push('Morate da unesetu novu lozinku dva puta');
    if (this.greskaPoruke.length > 0) {
      return;
    }
    if (this.nova_lozinka1 != this.nova_lozinka2) {
      this.greskaPoruke.push(
        'Proverite da li ste dobro uneli novu lozinku u oba polja'
      );
      return;
    }
    this.proveriFormat(this.nova_lozinka1);
    if (this.greskaPoruke.length > 0) {
      return;
    }
    this.gService
      .promeniLozinku(this.kor_ime, this.stara_lozinka, this.nova_lozinka1)
      .subscribe((data) => {
        if (data.poruka == 'ok') {
          alert('Lozinka je uspesno promenjena');
          this.router.navigate(['home/login']);
        } else {
          this.kService
            .promeniLozinku(
              this.kor_ime,
              this.stara_lozinka,
              this.nova_lozinka1
            )
            .subscribe((data) => {
              if (data.poruka == 'ok') {
                alert('Lozinka je uspesno promenjena');
                this.router.navigate(['home/login']);
              } else {
                this.aService
                  .promeniLozinku(
                    this.kor_ime,
                    this.stara_lozinka,
                    this.nova_lozinka1
                  )
                  .subscribe((data) => {
                    if (data.poruka == 'ok') {
                      alert('Lozinka je uspesno promenjena');
                      this.router.navigate(['home/login']);
                    } else {
                      this.greskaPoruke.push(
                        'Pogresno korisnicko ime ili lozinka'
                      );
                      this.mod = 1;
                    }
                  });
              }
            });
        }
      });
  }

  unaprediMod(): void {
    this.mod = 2;
    this.greskaPoruke = [];
    this.kor_ime = '';
    this.stara_lozinka = this.nova_lozinka1 = this.nova_lozinka2 = '';
  }

  dohvatiBezbPitanje(): void {
    this.greskaPoruke = [];
    if (this.kor_ime == '') {
      this.greskaPoruke.push('Morate da unesete korisnicko ime');
      return;
    }
    this.gService.dohvatiBezbPitanje(this.kor_ime).subscribe((data) => {
      if (data.poruka != '') {
        this.bezb_pitanje = data.poruka;
        this.mod = 3;
      } else {
        this.kService.dohvatiBezbPitanje(this.kor_ime).subscribe((data) => {
          if (data.poruka != '') {
            this.bezb_pitanje = data.poruka;
            this.mod = 3;
          } else {
            this.aService.dohvatiBezbPitanje(this.kor_ime).subscribe((data) => {
              if (data.poruka != '') {
                this.bezb_pitanje = data.poruka;
                this.mod = 3;
              } else {
                this.greskaPoruke.push('Pogresno korisnicko ime');
              }
            });
          }
        });
      }
    });
  }

  proveriBezbOdgovor(): void {
    this.greskaPoruke = [];
    if (this.bezb_odgovor == '') {
      this.greskaPoruke.push('Niste uneli odgovor na pitanje');
      return;
    }
    this.gService
      .proveriBezbOdgovor(this.kor_ime, this.bezb_odgovor)
      .subscribe((data) => {
        if (data.poruka == 'ok') {
          this.mod = 4;
        } else {
          this.kService
            .proveriBezbOdgovor(this.kor_ime, this.bezb_odgovor)
            .subscribe((data) => {
              if (data.poruka == 'ok') {
                this.mod = 4;
              } else {
                this.aService
                  .proveriBezbOdgovor(this.kor_ime, this.bezb_odgovor)
                  .subscribe((data) => {
                    if (data.poruka == 'ok') {
                      this.mod = 4;
                    } else {
                      this.greskaPoruke.push(
                        'Pogresan odgovor na bezbedonosno pitanje'
                      );
                      return;
                    }
                  });
              }
            });
        }
      });
  }

  promeniLozinkuProvereno(): void {
    this.greskaPoruke = [];
    if (this.nova_lozinka1 == '' || this.nova_lozinka2 == '') {
      this.greskaPoruke.push('Morate da unesetu novu lozinku dva puta');
      return;
    }
    if (this.nova_lozinka1 != this.nova_lozinka2) {
      this.greskaPoruke.push(
        'Proverite da li ste dobro uneli novu lozinku u oba polja'
      );
      return;
    }
    this.proveriFormat(this.nova_lozinka1);
    if (this.greskaPoruke.length > 0) {
      return;
    }
    this.gService
      .promeniLozinkuProvereno(
        this.kor_ime,
        this.bezb_odgovor,
        this.nova_lozinka1
      )
      .subscribe((data) => {
        if (data.poruka == 'ok') {
          alert('Lozinka je uspesno promenjena');
          this.router.navigate(['home/login']);
        } else {
          this.kService
            .promeniLozinkuProvereno(
              this.kor_ime,
              this.bezb_odgovor,
              this.nova_lozinka1
            )
            .subscribe((data) => {
              if (data.poruka == 'ok') {
                alert('Lozinka je uspesno promenjena');
                this.router.navigate(['home/login']);
              } else {
                this.aService
                  .promeniLozinkuProvereno(
                    this.kor_ime,
                    this.bezb_odgovor,
                    this.nova_lozinka1
                  )
                  .subscribe((data) => {
                    if (data.poruka == 'ok') {
                      alert('Lozinka je uspesno promenjena');
                      this.router.navigate(['home/login']);
                    } else {
                      this.greskaPoruke.push('Greska pri obradi zahteva');
                      this.bezb_odgovor = '';
                      this.bezb_pitanje = '';
                      this.nova_lozinka1 = '';
                      this.nova_lozinka2 = '';
                      this.mod = 1;
                    }
                  });
              }
            });
        }
      });
  }
}
