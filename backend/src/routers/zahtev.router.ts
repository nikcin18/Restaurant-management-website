import express from 'express'
import { ZahtevController } from '../controllers/zahtev.controller';

const zahtevRouter=express.Router();

zahtevRouter.route("/noviZahtev").post(
    (req,res)=>new ZahtevController().noviZahtev(req,res)
);

zahtevRouter.route("/dohvatiNeobradjeneZahteve").get(
    (req,res)=>new ZahtevController().dohvatiNeobradjeneZahteve(req,res)
)

zahtevRouter.route("/dohvatiSveZahteve").get(
    (req,res)=>new ZahtevController().dohvatiSveZahteve(req,res)
)

zahtevRouter.route("/odbijZahtev").post(
    (req,res)=>new ZahtevController().odbijZahtev(req,res)
);

zahtevRouter.route("/prihvatiZahtev").post(
    (req,res)=>new ZahtevController().prihvatiZahtev(req,res)
);

export default zahtevRouter;