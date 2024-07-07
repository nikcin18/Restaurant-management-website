import { Component, OnInit } from '@angular/core';
import { Zahtev } from 'src/app/models/Zahtev';
import { ZahtevService } from 'src/app/services/zahtev.service';

@Component({
  selector: 'app-admin-zahtevi',
  templateUrl: './admin-zahtevi.component.html',
  styleUrls: ['./admin-zahtevi.component.css']
})
export class AdminZahteviComponent implements OnInit {
  constructor(private zService: ZahtevService) { }

  zahtevi: Zahtev[] = [];

  ngOnInit(): void {
    this.zService.dohvatiSveZahteve().subscribe(
      data => {
        if (data) this.zahtevi = data;
      }
    )
  }

  prihvatiZahtev(id:number){
    this.zService.prihvatiZahtev(id).subscribe(
      data=>{
        if(data) this.zahtevi=data;
      }
    )
  }

  odbijZahtev(id:number){
    this.zService.odbijZahtev(id).subscribe(
      data=>{
        if(data) this.zahtevi=data;
      }
    )
  }
}
