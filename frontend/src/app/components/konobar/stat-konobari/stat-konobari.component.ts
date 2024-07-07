import { Component, Input } from '@angular/core';
import { LegendPosition } from '@swimlane/ngx-charts';
import { Konobar } from 'src/app/models/Konobar';
import { RezervacijaService } from 'src/app/services/rezervacija.service';

@Component({
  selector: 'app-stat-konobari',
  templateUrl: './stat-konobari.component.html',
  styleUrls: ['./stat-konobari.component.css'],
})
export class StatKonobariComponent {
  constructor(private rezService: RezervacijaService) {}

  @Input() konobar: Konobar = new Konobar();

  podaci: any[] = [];
  greska: boolean = true;
  prazno: boolean = true;
  ngOnInit(): void {
    this.rezService
      .dohvatiStatistikuKonobari(this.konobar.restoran)
      .subscribe((data: any) => {
        if (data) {
          this.greska = false;
          if (data.length > 0) {
            for (let d of data) {
              this.podaci.push({
                name: d.ime_prezime + ' (' + d.kor_ime + ')',
                value: d.broj,
              });
            }
            this.prazno = false;
          }
        }
      });
  }

  formirajOznaku(str: string) {
    let zagrada = str.lastIndexOf('(');
    let rezultat = str.substring(zagrada + 1, str.length - 1);
    return rezultat;
  }
}
