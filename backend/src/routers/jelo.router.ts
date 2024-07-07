import express from 'express'
import { JeloController } from '../controllers/jelo.controller';

const jeloRouter=express.Router();

jeloRouter.route("/dohvatiJela/:restoran").get(
    (req,res)=>new JeloController().dohvatiJela(req,res)
);

jeloRouter.route("/dodajUKorpu").post(
    (req,res)=>new JeloController().dodajUKorpu(req,res)
);

jeloRouter.route("/ukloniJeloIzKorpe").post(
    (req,res)=>new JeloController().ukloniJeloIzKorpe(req,res)
);

jeloRouter.route("/izmeniKolicinu").post(
    (req,res)=>new JeloController().izmeniKolicinu(req,res)
);

jeloRouter.route("/dohvatiKorpu/:gost/:restoran").get(
    (req,res)=>new JeloController().dohvatiKorpu(req,res)
);

export default jeloRouter;