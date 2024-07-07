import express from "express";
import { KonobarController } from "../controllers/konobar.controller";

const konobarRouter = express.Router();

konobarRouter
  .route("/login")
  .post((req, res) => new KonobarController().login(req, res));

konobarRouter
  .route("/dohvatiKonobara/:kor_ime")
  .get((req, res) => new KonobarController().dohvatiKonobara(req, res));

konobarRouter
  .route("/dohvatiSveKonobare")
  .get((req, res) => new KonobarController().dohvatiSveKonobare(req, res));

konobarRouter
  .route("/aktivirajKonobara")
  .post((req, res) => new KonobarController().aktivirajKonobara(req, res));

konobarRouter
  .route("/deaktivirajKonobara")
  .post((req, res) => new KonobarController().deaktivirajKonobara(req, res));

konobarRouter
  .route("/promeniRestoran")
  .post((req, res) => new KonobarController().promeniRestoran(req, res));

konobarRouter
  .route("/promeniLozinku")
  .post((req, res) => new KonobarController().promeniLozinku(req, res));

konobarRouter
  .route("/promeniLozinkuProvereno")
  .post((req, res) =>
    new KonobarController().promeniLozinkuProvereno(req, res)
  );

konobarRouter
  .route("/dohvatiBezbPitanje")
  .post((req, res) => new KonobarController().dohvatiBezbPitanje(req, res));

konobarRouter
  .route("/proveriBezbOdgovor")
  .post((req, res) => new KonobarController().proveriBezbOdgovor(req, res));

konobarRouter
  .route("/promeniImejl")
  .post((req, res) => new KonobarController().promeniImejl(req, res));

konobarRouter
  .route("/azurirajNalog")
  .post((req, res) => new KonobarController().azurirajNalog(req, res));

export default konobarRouter;
