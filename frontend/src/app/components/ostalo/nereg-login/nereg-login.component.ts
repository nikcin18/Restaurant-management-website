import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GostService } from '../../../services/gost.service';
import { KonobarService } from '../../../services/konobar.service';

@Component({
  selector: 'app-nereg-login',
  templateUrl: './nereg-login.component.html',
  styleUrls: ['./nereg-login.component.css'],
})
export class NeregLoginComponent implements OnInit {
  constructor(
    private router: Router,
    private gService: GostService,
    private kService: KonobarService
  ) {}

  kor_ime: string = '';
  lozinka: string = '';
  greska: string = '';
  upozorenje: string = '';

  ngOnInit(): void {
    sessionStorage.clear();
  }

  login(): void {
    this.greska = this.upozorenje = '';
    if (this.kor_ime == '' || this.lozinka == '') {
      this.greska = 'Niste popunili sva polja';
      return;
    }
    this.gService.login(this.kor_ime, this.lozinka).subscribe((data) => {
      if (data) {
        if (data.aktiviran == 0) {
          this.upozorenje =
            'Nedozvoljen pristup sistemu. Kontaktirajte administratora';
          return;
        }
        sessionStorage.setItem('gost', JSON.stringify(data));
        this.router.navigate(['../gosti']);
      } else {
        this.kService.login(this.kor_ime, this.lozinka).subscribe((data) => {
          if (data) {
            if (data.aktiviran == 0) {
              this.upozorenje =
                'Nedozvoljen pristup sistemu. Kontaktirajte administratora';
              return;
            }
            sessionStorage.setItem('konobar', JSON.stringify(data));
            this.router.navigate(['../konobari']);
          } else {
            this.greska = 'Pogresno korisnicko ime ili lozinka';
          }
        });
      }
    });
  }
}
