import express from "express";
import { RestoranController } from "../controllers/restoran.controller";

const restoranRouter = express.Router();

restoranRouter
  .route("/dohvatiSveRestorane")
  .get((req, res) => new RestoranController().dohvatiSveRestorane(req, res));

restoranRouter
  .route("/dohvatiSveKratko")
  .get((req, res) => new RestoranController().dohvatiSveKratko(req, res));

restoranRouter
  .route("/dohvatiRestoranId/:id")
  .get((req, res) => new RestoranController().dohvatiRestoranId(req, res));

restoranRouter
  .route("/pretragaRestorana")
  .post((req, res) => new RestoranController().pretragaRestorana(req, res));

restoranRouter
  .route("/dodajRestoran")
  .post((req, res) => new RestoranController().dodajRestoran(req, res));

export default restoranRouter;
