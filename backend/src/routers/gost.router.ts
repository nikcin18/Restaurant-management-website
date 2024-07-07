import express from "express";
import { GostController } from "../controllers/gost.controller";

const gostRouter = express.Router();

gostRouter
  .route("/login")
  .post((req, res) => new GostController().login(req, res));

gostRouter
  .route("/dohvatiGosta/:kor_ime")
  .get((req, res) => new GostController().dohvatiGosta(req, res));

gostRouter
  .route("/dohvatiSveGoste")
  .get((req, res) => new GostController().dohvatiSveGoste(req, res));

gostRouter
  .route("/aktivirajGosta")
  .post((req, res) => new GostController().aktivirajGosta(req, res));

gostRouter
  .route("/deaktivirajGosta")
  .post((req, res) => new GostController().deaktivirajGosta(req, res));

gostRouter
  .route("/promeniLozinku")
  .post((req, res) => new GostController().promeniLozinku(req, res));

gostRouter
  .route("/promeniLozinkuProvereno")
  .post((req, res) => new GostController().promeniLozinkuProvereno(req, res));

gostRouter
  .route("/dohvatiBezbPitanje")
  .post((req, res) => new GostController().dohvatiBezbPitanje(req, res));

gostRouter
  .route("/proveriBezbOdgovor")
  .post((req, res) => new GostController().proveriBezbOdgovor(req, res));

gostRouter
  .route("/dohvatiBrojGostiju")
  .get((req, res) => new GostController().dohvatiBrojGostiju(req, res));

gostRouter
  .route("/promeniImejl")
  .post((req, res) => new GostController().promeniImejl(req, res));

gostRouter
  .route("/azurirajNalog")
  .post((req, res) => new GostController().azurirajNalog(req, res));

gostRouter
  .route("/odblokirajGosta")
  .post((req, res) => new GostController().odblokirajGosta(req, res));

gostRouter
  .route("/blokirajGosta")
  .post((req, res) => new GostController().blokirajGosta(req, res));

export default gostRouter;
