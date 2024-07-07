import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css'],
})
export class AdminLoginComponent {
  constructor(private router: Router, private aService: AdminService) {}

  kor_ime: string = '';
  lozinka: string = '';
  greska: string = '';

  ngOnInit(): void {
    sessionStorage.clear();
  }

  login(): void {
    this.greska = '';
    if (this.kor_ime == '' || this.lozinka == '') {
      this.greska = 'Niste popunili sva polja';
      return;
    }
    this.aService.login(this.kor_ime, this.lozinka).subscribe((data) => {
      if (data) {
        sessionStorage.setItem('admin', JSON.stringify(data));
        this.router.navigate(['../admin']);
      } else {
        this.greska = 'Administrator ne postoji';
      }
    });
  }
}
