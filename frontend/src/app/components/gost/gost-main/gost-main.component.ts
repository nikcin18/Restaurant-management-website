import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Gost } from 'src/app/models/Gost';

@Component({
  selector: 'app-gost-main',
  templateUrl: './gost-main.component.html',
  styleUrls: ['./gost-main.component.css'],
})
export class GostMainComponent implements OnInit {
  constructor(private router: Router) {}

  gost: Gost = new Gost();

  ngOnInit(): void {
    let ss_gost = sessionStorage.getItem('gost');
    if (ss_gost == null || ss_gost == '') {
      this.router.navigate(['home/login']);
    } else this.gost = JSON.parse(ss_gost);
  }
}
