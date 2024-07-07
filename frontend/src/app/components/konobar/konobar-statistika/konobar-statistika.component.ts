import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Konobar } from 'src/app/models/Konobar';
import { RezervacijaService } from 'src/app/services/rezervacija.service';

@Component({
  selector: 'app-konobar-statistika',
  templateUrl: './konobar-statistika.component.html',
  styleUrls: ['./konobar-statistika.component.css']
})
export class KonobarStatistikaComponent implements OnInit{
  constructor(private router:Router,private rezService:RezervacijaService){}

  konobar:Konobar=new Konobar;
  
  ngOnInit(): void {
    let ls_konobar = sessionStorage.getItem("konobar");
    if (ls_konobar == null || ls_konobar == "") {
      this.router.navigate([""]);
    }
    else {
      this.konobar = JSON.parse(ls_konobar);
    }
  }
}
