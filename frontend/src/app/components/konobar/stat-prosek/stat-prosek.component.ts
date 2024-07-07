import { Component, Input, OnInit } from '@angular/core';
import { Konobar } from 'src/app/models/Konobar';
import { RezervacijaService } from 'src/app/services/rezervacija.service';

@Component({
  selector: 'app-stat-prosek',
  templateUrl: './stat-prosek.component.html',
  styleUrls: ['./stat-prosek.component.css'],
})
export class StatProsekComponent implements OnInit {
  constructor(private rezService: RezervacijaService) {}

  @Input() konobar: Konobar = new Konobar();

  color: string = '#5566ee';
  customColors: any[] = [
    { name: 'PON', value: this.color },
    { name: 'UTO', value: this.color },
    { name: 'SRE', value: this.color },
    { name: 'CET', value: this.color },
    { name: 'PET', value: this.color },
    { name: 'SUB', value: this.color },
    { name: 'NED', value: this.color },
  ];
  podaci: any[] = [];
  suma: number = 0;
  dani: string[] = ['PON', 'UTO', 'SRE', 'CET', 'PET', 'SUB', 'NED'];
  greska: boolean = true;
  ngOnInit(): void {
    this.rezService
      .dohvatiStatistikuProsek(this.konobar.restoran, this.konobar.kor_ime)
      .subscribe((data) => {
        if (data && data.length > 0) {
          for (let i = 0; i < 7; i++) {
            this.suma += data[i];
          }
          if (this.suma > 0) {
            for (let i = 0; i < 7; i++) {
              this.podaci.push({
                name: this.dani[i],
                value: Math.round((data[i] * 10000) / this.suma) / 100,
              });
            }
          }
          this.greska = false;
        }
      });
  }

  formirajOznaku(str: string) {
    return 'AAA';
  }
}
