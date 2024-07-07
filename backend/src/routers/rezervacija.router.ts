import express, { Router } from "express";
import { RezervacijaController } from "../controllers/rezervacija.controller";
import { RestoranController } from "../controllers/restoran.controller";

const rezervacijaRouter = express.Router();

rezervacijaRouter
  .route("/dohvatiNeobradjene/:restoran")
  .get((req, res) => new RezervacijaController().dohvatiNeobradjene(req, res));

rezervacijaRouter
  .route("/dohvatiPrihvacene/:restoran/:konobar")
  .get((req, res) => new RezervacijaController().dohvatiPrihvacene(req, res));

rezervacijaRouter
  .route("/odbijRezervaciju")
  .post((req, res) => new RezervacijaController().odbijRezervaciju(req, res));

rezervacijaRouter
  .route("/produziRezervaciju")
  .post((req, res) => new RezervacijaController().produziRezervaciju(req, res));

rezervacijaRouter
  .route("/oceniRezervaciju")
  .post((req, res) => new RezervacijaController().oceniRezervaciju(req, res));

rezervacijaRouter
  .route("/propustenaRezervacija")
  .post((req, res) =>
    new RezervacijaController().propustenaRezervacija(req, res)
  );

rezervacijaRouter
  .route("/posecenaRezervacija")
  .post((req, res) =>
    new RezervacijaController().posecenaRezervacija(req, res)
  );

rezervacijaRouter
  .route("/dohvatiStatistikuPocetna/:sada")
  .get((req, res) =>
    new RezervacijaController().dohvatiStatistikuPocetna(req, res)
  );

rezervacijaRouter
  .route("/dohvatiStatistikuDani/:restoran/:konobar")
  .get((req, res) =>
    new RezervacijaController().dohvatiStatistikuDani(req, res)
  );

rezervacijaRouter
  .route("/dohvatiStatistikuKonobari/:restoran")
  .get((req, res) =>
    new RezervacijaController().dohvatiStatistikuKonobari(req, res)
  );

rezervacijaRouter
  .route("/dohvatiStatistikuProsek/:restoran/:konobar")
  .get((req, res) =>
    new RezervacijaController().dohvatiStatistikuProsek(req, res)
  );

rezervacijaRouter
  .route("/posaljiRezervaciju1")
  .post((req, res) =>
    new RezervacijaController().posaljiRezervaciju1(req, res)
  );

rezervacijaRouter
  .route("/dohvatiRezervacijeGost/:gost")
  .get((req, res) =>
    new RezervacijaController().dohvatiRezervacijeGost(req, res)
  );

rezervacijaRouter
  .route("/dohvatiZauzeteStoloveGost/:gost/:restoran/:dan_posete/:pocetak")
  .get((req, res) =>
    new RezervacijaController().dohvatiZauzeteStoloveGost(req, res)
  );

rezervacijaRouter
  .route("/dohvatiZauzeteStoloveKonobar/:restoran/:dan_posete/:pocetak")
  .get((req, res) =>
    new RezervacijaController().dohvatiZauzeteStoloveKonobar(req, res)
  );

rezervacijaRouter
  .route("/posaljiRezervaciju2")
  .post((req, res) =>
    new RezervacijaController().posaljiRezervaciju2(req, res)
  );

rezervacijaRouter
  .route("/oceniRezervaciju")
  .post((req, res) => new RezervacijaController().oceniRezervaciju(req, res));

rezervacijaRouter
  .route("/otkaziRezervaciju")
  .post((req, res) => new RezervacijaController().otkaziRezervaciju(req, res));

rezervacijaRouter
  .route("/prihvatiRezervaciju")
  .post((req, res) =>
    new RezervacijaController().prihvatiRezervaciju(req, res)
  );

export default rezervacijaRouter;
