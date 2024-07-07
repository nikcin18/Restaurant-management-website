import { Component, OnInit } from '@angular/core';
import { Gost } from 'src/app/models/Gost';
import { Konobar } from 'src/app/models/Konobar';
import { Restoran } from 'src/app/models/Restoran';
import { GostService } from 'src/app/services/gost.service';
import { KonobarService } from 'src/app/services/konobar.service';
import { RestoranService } from 'src/app/services/restoran.service';

@Component({
  selector: 'app-admin-pregled',
  templateUrl: './admin-pregled.component.html',
  styleUrls: ['./admin-pregled.component.css']
})
export class AdminPregledComponent implements OnInit{
  constructor(private gService:GostService,
    private kService:KonobarService,
    private restService:RestoranService
  ){}

  gosti:Gost[]=[];
  konobari:Konobar[]=[];
  restorani:Restoran[]=[];

  ngOnInit(): void {
      this.gService.dohvatiSveGoste().subscribe(
        data=>{
          if(data) this.gosti=data;
        }
      )
      this.kService.dohvatiSveKonobare().subscribe(
        data=>{
          if(data) this.konobari=data;
        }
      )
      this.restService.dohvatiSveRestorane().subscribe(
        data=>{
          if(data) this.restorani=data;
        }
      )
  }
}
