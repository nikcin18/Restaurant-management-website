import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-greska',
  templateUrl: './greska.component.html',
  styleUrls: ['./greska.component.css'],
})
export class GreskaComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}
}
