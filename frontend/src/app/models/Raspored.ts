import { Krug } from "./Krug";
import { Kvadrat } from "./Kvadrat";

export class Raspored{
    visina:number=0;
    sirina:number=0;
    stolovi:Krug[]=[];
    kuhinje:Kvadrat[]=[];
    toaleti:Kvadrat[]=[];
}