import express, { json } from "express";
import JeloModel from "../models/jelo";
import EKModel from "../models/elementKorpe";
import { ObjectId } from "mongodb";

export class JeloController {
  dohvatiJelaUpit = (restoran: number, res: express.Response) => {
    JeloModel.find({ restoran: restoran })
      .then((data) => {
        if (data) res.json(data);
        else res.json(null);
      })
      .catch((err) => {
        console.log(err);
        res.json(null);
      });
  };

  dohvatiJela = (req: express.Request, res: express.Response) => {
    let restoran = Number.parseInt(req.params["restoran"]);
    this.dohvatiJelaUpit(restoran, res);
  };

  dodajUKorpu = (req: express.Request, res: express.Response) => {
    let restoranP = req.body.restoran;
    let gostP = req.body.gost;
    let jeloP = req.body.jelo;
    let kolicinaP = req.body.kolicina;
    EKModel.findOneAndUpdate(
      { gost: gostP, restoran: restoranP, jelo: jeloP },
      { $inc: { kolicina: kolicinaP } }
    )
      .then((data) => {
        if (data) this.pronadjiKorpu(gostP, restoranP, res);
        else {
          JeloModel.findOne({ id: jeloP })
            .then((jelo) => {
              if (jelo) {
                let noviElement = {
                  _id: new ObjectId(),
                  gost: gostP,
                  restoran: restoranP,
                  jelo: jeloP,
                  naziv: jelo.naziv,
                  cena: jelo.cena,
                  kolicina: kolicinaP,
                };
                new EKModel(noviElement)
                  .save()
                  .then((data) => {
                    this.pronadjiKorpu(gostP, restoranP, res);
                  })
                  .catch((err) => {
                    console.log(err);
                    res.json(null);
                  });
              } else res.json(null);
            })
            .catch((err) => {
              console.log(err);
              res.json(null);
            });
        }
      })
      .catch((err) => {
        console.log(err);
        res.json(null);
      });
  };

  ukloniJeloIzKorpe = (req: express.Request, res: express.Response) => {
    let restoranP = req.body.restoran;
    let gostP = req.body.gost;
    let jeloP = req.body.jelo;
    EKModel.deleteOne({ gost: gostP, restoran: restoranP, jelo: jeloP })
      .then((data) => {
        this.pronadjiKorpu(gostP, restoranP, res);
      })
      .catch((err) => {
        console.log(err);
        res.json(null);
      });
  };

  izmeniKolicinu = (req: express.Request, res: express.Response) => {
    let restoranP = req.body.restoran;
    let gostP = req.body.gost;
    let jeloP = req.body.jelo;
    let kolicinaP = req.body.kolicina;
    EKModel.findOneAndUpdate(
      { gost: gostP, restoran: restoranP, jelo: jeloP },
      { $set: { kolicina: kolicinaP } }
    )
      .then((data) => {
        if (data) this.pronadjiKorpu(gostP, restoranP, res);
        else res.json(null);
      })
      .catch((err) => {
        console.log(err);
        res.json(null);
      });
  };

  pronadjiKorpu(gostP: string, restoranP: number, res: express.Response) {
    EKModel.find({ gost: gostP, restoran: restoranP })
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        console.log(err);
        res.json(null);
      });
  }

  dohvatiKorpu = (req: express.Request, res: express.Response) => {
    let restoranP = Number.parseInt(req.params.restoran);
    let gostP = req.params.gost;
    this.pronadjiKorpu(gostP, restoranP, res);
  };

  /*ukloniJelo = (req: express.Request, res: express.Response) => {
    JeloModel.deleteOne({ id: req.body.id })
      .then((ok) => {
        this.dohvatiJelaUpit(req.body.restoran, res);
      })
      .catch((err) => {
        console.log(err);
        res.json({ poruka: "Greska pri radu sa bazom" });
      });
  };

  dodajJelo = (req: express.Request, res: express.Response) => {
    let id = 0;
    JeloModel.find({})
      .sort({ id: -1 })
      .limit(1)
      .then((data) => {
        if (data.length > 0) {
          id = data[0].id;
        }
        let jelo = req.body;
        jelo._id = new ObjectId();
        jelo.id = id + 1;
        new JeloModel(jelo)
          .save()
          .then((ok) => {
            this.dohvatiJelaUpit(req.body.restoran, res);
          })
          .catch((err) => {
            this.dohvatiJelaUpit(req.body.restoran, res);
          });
      })
      .catch((err) => {
        this.dohvatiJelaUpit(req.body.restoran, res);
      });
  };*/
}
