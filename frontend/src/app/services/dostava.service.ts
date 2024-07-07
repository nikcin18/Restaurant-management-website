import { HttpClient } from '@angular/common/http';
import { Injectable, getModuleFactory } from '@angular/core';
import { Poruka } from '../models/Poruka';
import { Dostava } from '../models/Dostava';
import { ElementKorpe } from '../models/ElementKorpe';

@Injectable({
  providedIn: 'root'
})
export class DostavaService {
  constructor(private http:HttpClient) { }

  host:string="localhost";
  baza:string="http://"+this.host+":4000/dostave/";

  naruciKorpu(gostP:string,restoranP:number,nazivP:string,sadrzajP:string[],racunP:number){
    const novaDostava=new Dostava();
    novaDostava.gost=gostP;
    novaDostava.restoran=restoranP;
    novaDostava.naziv_restorana=nazivP;
    novaDostava.sadrzaj=sadrzajP;
    novaDostava.racun=racunP;
    return this.http.post<Poruka>(this.baza+"/naruciKorpu",novaDostava);
  }

  dohvatiDostaveGost(gostP:string){
    return this.http.get<Dostava[]>(this.baza+"/dohvatiDostaveGost/"+gostP);
  }
  
  dohvatiNeobradjene(restoran:number){
    return this.http.get<Dostava[]>(this.baza+"/dohvatiNeobradjene/"+restoran);
  }

  prihvatiDostavu(idP:number,restoranP:number,procenjeno_vremeP:number){
    const data={
      id:idP,
      restoran:restoranP,
      procenjeno_vreme:procenjeno_vremeP
    }
    return this.http.post<Dostava[]>(this.baza+"/prihvatiDostavu",data);
  }

  odbijDostavu(idP:number,restoranP:number){
    const data={
      id:idP,
      restoran:restoranP
    }
    return this.http.post<Dostava[]>(this.baza+"/odbijDostavu",data);
  }
}
