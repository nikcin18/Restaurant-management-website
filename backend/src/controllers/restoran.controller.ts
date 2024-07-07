import express, { json } from "express";
import RestoranModel from "../models/restoran";
import KonobarModel from "../models/konobar";
import RezervacijaModel from "../models/rezervacija";
import OcenaModel from "../models/ocena";
import { ObjectId } from "mongodb";

export class RestoranController {
  restoraniUpit(filter: any, res: express.Response) {
    RestoranModel.find(filter)
      .then(async (data) => {
        if (data) {
          if (data.length == 0) res.json([]);
          let spisak = <any[]>[];
          for (let i = 0; i < data.length; i++) {
            let kopija = {
              id: data[i].id,
              naziv: data[i].naziv,
              tip: data[i].tip,
              opis: data[i].opis,
              zaposleni: <any[]>[],
              ocene: <any[]>[],
              adresa: data[i].adresa,
              kontakt: data[i].kontakt,
            };
            KonobarModel.find({ "restoran": data[i].id })
              .then((konobari) => {
                for (let k of konobari) {
                  kopija.zaposleni.push(k.ime + " " + k.prezime);
                }
                OcenaModel.find({ "restoran": data[i].id })
                  .then((ocene) => {
                    for (let o of ocene) {
                      kopija.ocene.push({
                        tekst: o.tekst,
                        broj: o.broj,
                        gost: o.gost,
                      });
                    }
                    //console.log(JSON.stringify(kopija.ocene));
                    spisak.push(kopija);
                    //console.log("k+r+ "+spisak.length+"/"+data.length);
                    //console.log("restoran "+data[i].id);
                    if (spisak.length == data.length) res.json(spisak);
                  })
                  .catch((err) => {
                    spisak.push(kopija);
                    if (spisak.length == data.length) res.json(spisak);
                  });
              })
              .catch((err) => {
                OcenaModel.find({ "restoran": data[i].id })
                  .then((ocene) => {
                    for (let o of ocene) {
                      kopija.ocene.push({
                        tekst: o.tekst,
                        broj: o.broj,
                        gost: o.gost,
                      });
                    }
                    spisak.push(kopija);
                    if (spisak.length == data.length) res.json(spisak);
                  })
                  .catch((err) => {
                    console.log(err);
                    spisak.push(kopija);
                    if (spisak.length == data.length) res.json(spisak);
                  });
              });
          }
        } else res.json(null);
      })
      .catch((err) => {
        console.log(err);
        res.json(null);
      });
  }

  dohvatiSveRestorane = (req: express.Request, res: express.Response) => {
    this.restoraniUpit({}, res);
  };

  dohvatiSveKratko = (req: express.Request, res: express.Response) => {
    let spisak = <any[]>[];
    RestoranModel.find({})
      .then((data: any) => {
        if (data) {
          for (let d of data)
            if (d.naziv && d.id) spisak.push({ naziv: d.naziv, id: d.id });
        }
        res.json(spisak);
      })
      .catch((err) => {
        console.log(err);
        res.json(spisak);
      });
  };

  dohvatiRestoranId = (req: express.Request, res: express.Response) => {
    let idP = req.params["id"];
    RestoranModel.findOne({ "id": idP })
      .then((data) => {
        if (data) {
          let kopija = {
            id: data.id,
            naziv: data.naziv,
            tip: data.tip,
            opis: data.opis,
            zaposleni: <any[]>[],
            ocene: <any[]>[],
            adresa: data.adresa,
            kontakt: data.kontakt,
            raspored: data.raspored,
          };
          KonobarModel.find({ "restoran": data.id })
            .then((konobari) => {
              for (let k of konobari) {
                kopija.zaposleni.push(k.ime + " " + k.prezime);
              }
              OcenaModel.find({ "restoran": idP })
                .then((ocene) => {
                  for (let o of ocene) {
                    kopija.ocene.push({
                      tekst: o.tekst,
                      broj: o.broj,
                      gost: o.gost,
                    });
                  }
                  res.json(kopija);
                })
                .catch((err) => {
                  console.log(err);
                  res.json(kopija);
                });
            })
            .catch((err) => {
              OcenaModel.find({ "restoran": idP })
                .then((ocene) => {
                  for (let o of ocene) {
                    kopija.ocene.push({
                      tekst: o.tekst,
                      broj: o.broj,
                      gost: o.gost,
                    });
                  }
                  res.json(kopija);
                })
                .catch((err) => {
                  console.log(err);
                  res.json(kopija);
                });
            });
        } else res.json(null);
      })
      .catch((err) => {
        console.log(err);
        res.json(null);
      });
  };

  pretragaRestorana = (req: express.Request, res: express.Response) => {
    const filter = {
      "naziv": { $regex: req.body.naziv, $options: "i" },
      "tip": { $regex: req.body.tip, $options: "i" },
      "adresa": { $regex: req.body.adresa, $options: "i" },
    };
    this.restoraniUpit(filter, res);
  };

  dodajRestoran = (req: express.Request, res: express.Response) => {
    let restoran = req.body;
    let id = 0;
    RestoranModel.find({})
      .sort({ "id": -1 })
      .limit(1)
      .then((data) => {
        if (data && data.length > 0) {
          id = data[0].id;
        }
        restoran.id = id + 1;
        restoran._id = new ObjectId();
        new RestoranModel(restoran)
          .save()
          .then((data) => {
            if (data) res.json({ poruka: "ok" });
            else res.json({ poruka: "Greska pri radu sa bazom" });
          })
          .catch((err) => {
            res.json({ poruka: "Greska pri radu sa bazom" });
          });
      })
      .catch((err) => {
        console.log(err);
        res.json({ poruka: "Greska pri radu sa bazom" });
      });
  };
}
