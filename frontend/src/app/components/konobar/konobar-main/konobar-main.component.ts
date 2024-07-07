import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Konobar } from 'src/app/models/Konobar';

@Component({
  selector: 'app-konobar-main',
  templateUrl: './konobar-main.component.html',
  styleUrls: ['./konobar-main.component.css'],
})
export class KonobarMainComponent implements OnInit {
  constructor(private router: Router) {}

  konobar: Konobar = new Konobar();

  ngOnInit(): void {
    let ss_konobar = sessionStorage.getItem('konobar');
    if (ss_konobar == null || ss_konobar == '') {
      this.router.navigate(['home/login']);
    } else this.konobar = JSON.parse(ss_konobar);
  }
}
