import express, { json } from "express";
import EKModel from "../models/elementKorpe";
import DostavaModel from "../models/dostava";
import GostModel from "../models/gost";
import RestoranModel from "../models/restoran";
import { ObjectId } from "mongodb";

export class DostavaController {
  naruciKorpu = async (req: express.Request, res: express.Response) => {
    let novaDostava = req.body;
    let restoranP = novaDostava.restoran;
    let gostP = novaDostava.gost;
    try {
      let gost = await GostModel.findOne({ "kor_ime": gostP });
      if (gost == null) {
        res.json({ poruka: "Ne postoji gost" });
        return;
      }
      let restoran = await RestoranModel.findOne({ "id": restoranP });
      if (restoran == null) {
        res.json({ poruka: "Ne postoji restoran" });
        return;
      }
      let temp = await DostavaModel.find({}).sort({ "id": -1 }).limit(1);
      let maxId = temp.length > 0 ? temp[0].id : 0;
      await EKModel.deleteMany({ gost: gostP, restoran: restoranP });
      novaDostava._id = new ObjectId();
      novaDostava.id = maxId + 1;
      novaDostava.ime_prezime = gost.ime + " " + gost.prezime;
      novaDostava.naziv_restorana = restoran.naziv;
      novaDostava.adresa_gosta = gost.adresa;
      novaDostava.status = "neobradjena";
      novaDostava.datum = Date.now();
      novaDostava.procenjeno_vreme = 0;
      new DostavaModel(novaDostava)
        .save()
        .then((ok) => {
          res.json({ poruka: "ok" });
        })
        .catch((err) => {
          console.log(err);
          res.json({ poruka: "Greska pri radu sa bazom" });
        });
    } catch (err) {
      console.log(err);
      res.json({ poruka: "Greska pri radu sa bazom" });
    }
  };

  vratiNeobradjene = (restoranP: number, res: express.Response) => {
    DostavaModel.find({ restoran: restoranP, status: "neobradjena" })
      .then((dostave) => {
        res.json(dostave);
      })
      .catch((err) => {
        console.log(err);
        res.json(null);
      });
  };

  dohvatiDostaveGost = (req: express.Request, res: express.Response) => {
    let gostP = req.params.gost;
    DostavaModel.find({ "gost": gostP, "status": { $nin: ["odbijena"] } })
      .sort({ procenjeno_vreme: -1 })
      .then((dostave) => {
        res.json(dostave);
      })
      .catch((err) => {
        console.log(err);
        res.json(null);
      });
  };

  dohvatiNeobradjene = (req: express.Request, res: express.Response) => {
    this.vratiNeobradjene(Number.parseInt(req.params.restoran), res);
  };

  odbijDostavu(req: express.Request, res: express.Response) {
    let idP = req.body.id;
    let restoranP = req.body.restoran;
    DostavaModel.updateOne(
      { id: idP, status: "neobradjena" },
      { $set: { status: "odbijena" } }
    )
      .then((ok) => {
        this.vratiNeobradjene(restoranP, res);
      })
      .catch((err) => {
        console.log(err);
        this.vratiNeobradjene(restoranP, res);
      });
  }

  prihvatiDostavu(req: express.Request, res: express.Response) {
    let idP = req.body.id;
    let restoranP = req.body.restoran;
    let procenjeno_vremeP = req.body.procenjeno_vreme;
    DostavaModel.updateOne(
      { id: idP, status: "neobradjena" },
      { $set: { status: "prihvacena", procenjeno_vreme: procenjeno_vremeP } }
    )
      .then((ok) => {
        this.vratiNeobradjene(restoranP, res);
      })
      .catch((err) => {
        console.log(err);
        this.vratiNeobradjene(restoranP, res);
      });
  }
}
