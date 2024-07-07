import express from 'express'
import { DostavaController } from '../controllers/dostava.controller';

const dostavaRouter=express.Router();

dostavaRouter.route("/naruciKorpu").post(
    (req,res)=>new DostavaController().naruciKorpu(req,res)
);

dostavaRouter.route("/dohvatiDostaveGost/:gost").get(
    (req,res)=>new DostavaController().dohvatiDostaveGost(req,res)
);

dostavaRouter.route("/dohvatiNeobradjene/:restoran").get(
    (req,res)=>new DostavaController().dohvatiNeobradjene(req,res)
);

dostavaRouter.route("/odbijDostavu").post(
    (req,res)=>new DostavaController().odbijDostavu(req,res)
);

dostavaRouter.route("/prihvatiDostavu").post(
    (req,res)=>new DostavaController().prihvatiDostavu(req,res)
);

export default dostavaRouter;