import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GostMainComponent } from './components/gost/gost-main/gost-main.component';
import { GostProfilComponent } from './components/gost/gost-profil/gost-profil.component';
import { GostRestoraniComponent } from './components/gost/gost-restorani/gost-restorani.component';
import { GostRezervacijeComponent } from './components/gost/gost-rezervacije/gost-rezervacije.component';
import { GostDostavaComponent } from './components/gost/gost-dostava/gost-dostava.component';
import { KonobarMainComponent } from './components/konobar/konobar-main/konobar-main.component';
import { KonobarProfilComponent } from './components/konobar/konobar-profil/konobar-profil.component';
import { KonobarRezervacijeComponent } from './components/konobar/konobar-rezervacije/konobar-rezervacije.component';
import { KonobarDostavaComponent } from './components/konobar/konobar-dostava/konobar-dostava.component';
import { KonobarStatistikaComponent } from './components/konobar/konobar-statistika/konobar-statistika.component';
import { AdminLoginComponent } from './components/ostalo/admin-login/admin-login.component';
import { GreskaComponent } from './components/ostalo/greska/greska.component';
import { AdminMainComponent } from './components/admin/admin-main/admin-main.component';
import { NeregLoginComponent } from './components/ostalo/nereg-login/nereg-login.component';
import { NeregRegComponent } from './components/ostalo/nereg-reg/nereg-reg.component';
import { NeregPocetnaComponent } from './components/ostalo/nereg-pocetna/nereg-pocetna.component';
import { PromeniLozinkuComponent } from './components/ostalo/promeni-lozinku/promeni-lozinku.component';
import { RestoranInfoComponent } from './components/gost/restoran-info/restoran-info.component';
import { AdminZahteviComponent } from './components/admin/admin-zahtevi/admin-zahtevi.component';
import { AdminDodajKonComponent } from './components/admin/admin-dodaj-kon/admin-dodaj-kon.component';
import { AdminDodajRestComponent } from './components/admin/admin-dodaj-rest/admin-dodaj-rest.component';
import { AdminPregledComponent } from './components/admin/admin-pregled/admin-pregled.component';
import { AdminGostComponent } from './components/admin/admin-gost/admin-gost.component';
import { AdminKonobarComponent } from './components/admin/admin-konobar/admin-konobar.component';
import { GostKorpaComponent } from './components/gost/gost-korpa/gost-korpa.component';
import { NeregMainComponent } from './components/ostalo/nereg-main/nereg-main.component';
import { Greska2Component } from './components/ostalo/greska2/greska2.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    component: NeregMainComponent,
    children: [
      { path: '', redirectTo: 'pocetna', pathMatch: 'full' },
      { path: 'pocetna', component: NeregPocetnaComponent },
      { path: 'login', component: NeregLoginComponent },
      { path: 'registracija', component: NeregRegComponent },
      { path: 'promena', component: PromeniLozinkuComponent },
      { path: 'tajna', component: AdminLoginComponent },
      { path: '**', component: GreskaComponent },
    ],
  },
  {
    path: 'gosti',
    component: GostMainComponent,
    children: [
      { path: '', redirectTo: 'profil', pathMatch: 'full' },
      { path: 'profil', component: GostProfilComponent },
      {
        path: 'restorani',
        children: [
          { path: '', redirectTo: 'svi', pathMatch: 'full' },
          { path: 'svi', component: GostRestoraniComponent },
          { path: 'info', component: RestoranInfoComponent },
          { path: 'korpa', component: GostKorpaComponent },
          { path: '**', component: GreskaComponent },
        ],
      },
      { path: 'rezervacije', component: GostRezervacijeComponent },
      { path: 'dostava', component: GostDostavaComponent },
      { path: 'promena', component: PromeniLozinkuComponent },
      { path: 'info', component: RestoranInfoComponent },
      { path: '**', component: GreskaComponent },
    ],
  },
  {
    path: 'konobari',
    component: KonobarMainComponent,
    children: [
      { path: '', redirectTo: 'profil', pathMatch: 'full' },
      { path: 'profil', component: KonobarProfilComponent },
      { path: 'rezervacije', component: KonobarRezervacijeComponent },
      { path: 'dostava', component: KonobarDostavaComponent },
      { path: 'statistika', component: KonobarStatistikaComponent },
      { path: 'promena', component: PromeniLozinkuComponent },
      { path: '**', component: GreskaComponent },
    ],
  },
  {
    path: 'admin',
    component: AdminMainComponent,
    children: [
      { path: '', redirectTo: 'pregled', pathMatch: 'full' },
      { path: 'pregled', component: AdminPregledComponent },
      { path: 'gost', component: AdminGostComponent },
      { path: 'konobar', component: AdminKonobarComponent },
      { path: 'zahtevi', component: AdminZahteviComponent },
      { path: 'dodajKon', component: AdminDodajKonComponent },
      { path: 'dodajRest', component: AdminDodajRestComponent },
      { path: 'promena', component: PromeniLozinkuComponent },
      { path: '**', component: GreskaComponent },
    ],
  },
  {
    path: '**',
    component: Greska2Component,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
