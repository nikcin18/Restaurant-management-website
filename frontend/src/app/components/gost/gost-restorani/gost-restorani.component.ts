import { Component, OnInit } from '@angular/core';
import { Ocena } from 'src/app/models/Ocena';
import { Restoran } from 'src/app/models/Restoran';
import { GostService } from 'src/app/services/gost.service';
import { RestoranService } from 'src/app/services/restoran.service';

@Component({
  selector: 'app-gost-restorani',
  templateUrl: './gost-restorani.component.html',
  styleUrls: ['./gost-restorani.component.css']
})
export class GostRestoraniComponent implements OnInit{
  constructor(private rService: RestoranService
  ) { }

  restorani:Restoran[]=[];
  pretragaNaziv:string="";
  pretragaTip:string="";
  pretragaAdresa:string="";

  ngOnInit(): void {
    this.rService.dohvatiSveRestorane().subscribe(
      data=>{
        if(data!=null){
          this.restorani=data;
          this.sortirajNazivR();
        }
      }
    )
  }

  prosek(ocene:Ocena[]){
    let suma=0.0;
    let brojOcena=0;
    for(let o of ocene){
      suma+=o.broj;
      brojOcena++;
    }
    if(brojOcena>0) return Math.round(suma * 100.0 / brojOcena) / 100.0;
    else return 0;
  }

  zvezde(pr:number){
    let urls=<number[]>[];
    while(pr>=0.75){
      urls.push(2);
      pr--;
    }
    while(pr>=0.25){
      urls.push(1);
      pr--;
    }
    while(urls.length<5) urls.push(0);
    return urls;
  }

  pretragaRestorana():void{
    this.rService.pretragaRestorana(this.pretragaNaziv,this.pretragaTip,this.pretragaAdresa).subscribe(
      data=>{
        if(data!=null){
          this.restorani=data;
          this.sortirajNazivR();
        }
      }
    )
  }

  sortirajNazivO(): void {
    this.restorani.sort(function (r1, r2) {
      return r2.naziv.localeCompare(r1.naziv);
    });
  }

  sortirajNazivR(): void {
    this.restorani.sort(function (r1, r2) {
      return r1.naziv.localeCompare(r2.naziv);
    });
  }

  sortirajAdresaO(): void {
    this.restorani.sort(function (r1, r2) {
      return r2.adresa.localeCompare(r1.adresa);
    });
  }

  sortirajAdresaR(): void {
    this.restorani.sort(function (r1, r2) {
      return r1.adresa.localeCompare(r2.adresa);
    });
  }

  sortirajTipO(): void {
    this.restorani.sort(function (r1, r2) {
      return r2.tip.localeCompare(r1.tip);
    });
  }

  sortirajTipR(): void {
    this.restorani.sort(function (r1, r2) {
      return r1.tip.localeCompare(r2.tip);
    });
  }
}
