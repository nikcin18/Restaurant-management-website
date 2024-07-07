import { Component, Input, OnInit } from '@angular/core';
import { Konobar } from 'src/app/models/Konobar';
import { RezervacijaService } from 'src/app/services/rezervacija.service';

@Component({
  selector: 'app-stat-dani',
  templateUrl: './stat-dani.component.html',
  styleUrls: ['./stat-dani.component.css'],
})
export class StatDaniComponent implements OnInit {
  constructor(private rezService: RezervacijaService) {}

  @Input() konobar: Konobar = new Konobar();

  brojevi: number[] = [];
  greska: boolean = false;
  dani: string[] = ['PON', 'UTO', 'SRE', 'CET', 'PET', 'SUB', 'NED'];
  podaci: any[] = [];
  customColors: any[] = [
    { name: 'PON', value: '#FF0000' },
    { name: 'UTO', value: '#54ACED' },
    { name: 'SRE', value: '#7FED42' },
    { name: 'CET', value: '#FFA019' },
    { name: 'PET', value: '#B52AE6' },
    { name: 'SUB', value: '#C4C4C4' },
    { name: 'NED', value: '#FFFC4C' },
  ];

  ngOnInit(): void {
    this.greska = true;
    this.rezService
      .dohvatiStatistikuDani(this.konobar.restoran, this.konobar.kor_ime)
      .subscribe((data) => {
        if (data.length > 1) {
          for (let i = 0; i < 7; i++) {
            //this.podaci.push({ name: this.dani[i], value: data[i] });
            this.podaci.push({
              name: this.dani[i],
              value: data[i],
            });
          }
          this.greska = false;
        }
      });
  }
}
