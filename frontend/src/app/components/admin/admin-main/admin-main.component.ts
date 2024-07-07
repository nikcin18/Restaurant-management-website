import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Admin } from 'src/app/models/Admin';

@Component({
  selector: 'app-admin-main',
  templateUrl: './admin-main.component.html',
  styleUrls: ['./admin-main.component.css'],
})
export class AdminMainComponent implements OnInit {
  constructor(private router: Router) {}

  admin: Admin = new Admin();

  ngOnInit(): void {
    let ss_admin = sessionStorage.getItem('admin');
    if (ss_admin == null || ss_admin == '') {
      this.router.navigate(['home/login']);
    } else this.admin = JSON.parse(ss_admin);
  }
}
