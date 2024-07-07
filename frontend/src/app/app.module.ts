import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { GostMainComponent } from './components/gost/gost-main/gost-main.component';
import { GostProfilComponent } from './components/gost/gost-profil/gost-profil.component';
import { GostRestoraniComponent } from './components/gost/gost-restorani/gost-restorani.component';
import { GostRezervacijeComponent } from './components/gost/gost-rezervacije/gost-rezervacije.component';
import { GostDostavaComponent } from './components/gost/gost-dostava/gost-dostava.component';
import { KonobarProfilComponent } from './components/konobar/konobar-profil/konobar-profil.component';
import { KonobarRezervacijeComponent } from './components/konobar/konobar-rezervacije/konobar-rezervacije.component';
import { KonobarDostavaComponent } from './components/konobar/konobar-dostava/konobar-dostava.component';
import { KonobarStatistikaComponent } from './components/konobar/konobar-statistika/konobar-statistika.component';
import { KonobarMainComponent } from './components/konobar/konobar-main/konobar-main.component';
import { AdminLoginComponent } from './components/ostalo/admin-login/admin-login.component';
import { GreskaComponent } from './components/ostalo/greska/greska.component';
import { AdminMainComponent } from './components/admin/admin-main/admin-main.component';
import { SafePipe } from './safe-pipe';
import { NeregLoginComponent } from './components/ostalo/nereg-login/nereg-login.component';
import { NeregRegComponent } from './components/ostalo/nereg-reg/nereg-reg.component';
import { PromeniLozinkuComponent } from './components/ostalo/promeni-lozinku/promeni-lozinku.component';
import { NeregPocetnaComponent } from './components/ostalo/nereg-pocetna/nereg-pocetna.component';
import { RestoranInfoComponent } from './components/gost/restoran-info/restoran-info.component';
import { StatDaniComponent } from './components/konobar/stat-dani/stat-dani.component';
import { StatKonobariComponent } from './components/konobar/stat-konobari/stat-konobari.component';
import { StatProsekComponent } from './components/konobar/stat-prosek/stat-prosek.component';
import { AdminZahteviComponent } from './components/admin/admin-zahtevi/admin-zahtevi.component';
import { AdminDodajKonComponent } from './components/admin/admin-dodaj-kon/admin-dodaj-kon.component';
import { AdminDodajRestComponent } from './components/admin/admin-dodaj-rest/admin-dodaj-rest.component';
import { AdminPregledComponent } from './components/admin/admin-pregled/admin-pregled.component';
import { AdminGostComponent } from './components/admin/admin-gost/admin-gost.component';
import { AdminKonobarComponent } from './components/admin/admin-konobar/admin-konobar.component';
import { GostKorpaComponent } from './components/gost/gost-korpa/gost-korpa.component';
import { NeregMainComponent } from './components/ostalo/nereg-main/nereg-main.component';
import { AdminRasporedComponent } from './components/admin/admin-raspored/admin-raspored.component';
import { AdminRadnoVremeComponent } from './components/admin/admin-radno-vreme/admin-radno-vreme.component';
import { Greska2Component } from './components/ostalo/greska2/greska2.component';

@NgModule({
  declarations: [
    AppComponent,
    GostMainComponent,
    GostProfilComponent,
    GostRestoraniComponent,
    GostRezervacijeComponent,
    GostDostavaComponent,
    KonobarProfilComponent,
    KonobarRezervacijeComponent,
    KonobarDostavaComponent,
    KonobarStatistikaComponent,
    KonobarMainComponent,
    AdminLoginComponent,
    GreskaComponent,
    AdminMainComponent,
    SafePipe,
    NeregLoginComponent,
    NeregRegComponent,
    PromeniLozinkuComponent,
    NeregPocetnaComponent,
    RestoranInfoComponent,
    StatDaniComponent,
    StatKonobariComponent,
    StatProsekComponent,
    AdminZahteviComponent,
    AdminDodajKonComponent,
    AdminDodajRestComponent,
    AdminPregledComponent,
    AdminGostComponent,
    AdminKonobarComponent,
    GostKorpaComponent,
    NeregMainComponent,
    AdminRasporedComponent,
    AdminRadnoVremeComponent,
    Greska2Component,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgxChartsModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
