import express from "express";
import AdminModel from "../models/admin";
import GostModel from "../models/gost";
import KonobarModel from "../models/konobar";
import ZahtevModel from "../models/zahtev";
import { ObjectId } from "mongodb";

export class AdminController {
  powerMod = (base: number, exp: number, mod: number) => {
    let res = 1;
    let mul = base % mod;
    let e = 1;
    while (e <= exp) {
      if (e & exp) res = (res * mul) % mod;
      e *= 2;
      mul = (mul * mul) % mod;
    }
    return res;
  };

  kriptujLozinku = (plaintext: string) => {
    const n = 95,
      e = 29,
      d = 5;
    let filler = 0;
    for (let i = 0; i < plaintext.length; i++) {
      filler = filler + plaintext.charCodeAt(i) - 32;
    }
    filler %= 95;
    let l = plaintext.length;
    let ciphertext = "";
    ciphertext += String.fromCharCode(this.powerMod(l, e, n) + 32);
    for (let i = 0; i < 16 - l; i++) {
      let ind = (filler + 7) % 95;
      filler = (filler + 1) % 95;
      ciphertext += String.fromCharCode(this.powerMod(ind, e, n) + 32);
    }
    for (let i = l - 1; i >= 0; i--) {
      let ind = (plaintext.charCodeAt(i) - 32 + 7) % 95;
      ciphertext += String.fromCharCode(this.powerMod(ind, e, n) + 32);
    }
    return ciphertext;
  };

  dekriptujLozinku = (ciphertext: string) => {
    const n = 95,
      e = 29,
      d = 5;
    let ind = ciphertext.charCodeAt(0) - 32;
    let l = this.powerMod(ind, d, n);
    let f = ciphertext.length - l;
    let plaintext = "";
    for (let i = ciphertext.length - 1; i >= f; i--) {
      ind = ciphertext.charCodeAt(i) - 32;
      let k = (this.powerMod(ind, d, n) + 95 - 7) % 95;
      plaintext += String.fromCharCode(k + 32);
    }
    return plaintext;
  };

  login = (req: express.Request, res: express.Response) => {
    let kor_imeP = req.body.kor_ime;
    let lozinkaP = req.body.lozinka;

    AdminModel.findOne({ "kor_ime": kor_imeP })
      .then((data) => {
        if (data && data.lozinka) {
          if (this.dekriptujLozinku(data.lozinka) == lozinkaP) {
            data.lozinka = "";
            res.json(data);
          } else res.json(null);
        } else res.json(null);
      })
      .catch((err) => {
        console.log(err);
        res.json(null);
      });
  };

  promeniLozinku = (req: express.Request, res: express.Response) => {
    let kor_ime = req.body.kor_ime;
    let stara_lozinka = req.body.stara_lozinka;
    let nova_lozinka = req.body.nova_lozinka;
    AdminModel.findOneAndUpdate(
      {
        "kor_ime": kor_ime,
        "lozinka": this.kriptujLozinku(stara_lozinka),
      },
      { $set: { "lozinka": this.kriptujLozinku(nova_lozinka) } }
    )
      .then((data) => {
        if (data) {
          res.json({ poruka: "ok" });
        } else res.json({ poruka: "nema" });
      })
      .catch((err) => {
        console.log(err);
        res.json({ poruka: "greska" });
      });
  };

  promeniLozinkuProvereno = (req: express.Request, res: express.Response) => {
    let kor_ime = req.body.kor_ime;
    let bezb_odgovor = req.body.bezb_odgovor;
    let nova_lozinka = req.body.nova_lozinka;
    AdminModel.findOneAndUpdate(
      { "kor_ime": kor_ime, "bezb_odgovor": bezb_odgovor },
      { $set: { "lozinka": this.kriptujLozinku(nova_lozinka) } }
    )
      .then((data) => {
        if (data) {
          res.json({ poruka: "ok" });
        } else res.json({ poruka: "nema" });
      })
      .catch((err) => {
        console.log(err);
        res.json({ poruka: "greska" });
      });
  };

  dohvatiBezbPitanje = (req: express.Request, res: express.Response) => {
    let kor_ime = req.body.kor_ime;
    AdminModel.findOne({ "kor_ime": kor_ime })
      .then((data) => {
        if (data) {
          res.json({ poruka: data.bezb_pitanje });
        } else res.json({ poruka: "" });
      })
      .catch((err) => {
        console.log(err);
        res.json({ poruka: "" });
      });
  };

  proveriBezbOdgovor = (req: express.Request, res: express.Response) => {
    let kor_ime = req.body.kor_ime;
    let bezb_odgovor = req.body.bezb_odgovor;
    AdminModel.findOne({
      "kor_ime": kor_ime,
      "bezb_odgovor": bezb_odgovor,
    })
      .then((data) => {
        if (data) {
          res.json({ poruka: "ok" });
        } else res.json({ poruka: "nema" });
      })
      .catch((err) => {
        console.log(err);
        res.json({ poruka: "greska" });
      });
  };

  dodajKonobara = (req: express.Request, res: express.Response) => {
    let konobar = req.body;
    konobar._id = new ObjectId();
    konobar.lozinka = this.kriptujLozinku(req.body.lozinka);
    konobar.aktiviran = 1;
    new KonobarModel(konobar)
      .save()
      .then((data) => {
        res.json({ poruka: "ok" });
      })
      .catch((err) => {
        res.json({ poruka: "Greska pri radu sa bazom podataka: " + err });
      });
  };

  zahtevKonobar = (req: express.Request, res: express.Response) => {
    GostModel.find({})
      .then((data1) => {
        KonobarModel.find({})
          .then((data2) => {
            AdminModel.find({})
              .then((data3) => {
                ZahtevModel.find({ "status": "odbijen" })
                  .then((data4) => {
                    let duplikati_kor_ime = [];
                    let duplikati_imejl = [];
                    for (let d1 of data1) {
                      if (d1.kor_ime) duplikati_kor_ime.push(d1.kor_ime);
                      if (d1.imejl) duplikati_imejl.push(d1.imejl);
                    }
                    for (let d2 of data2) {
                      if (d2.kor_ime) duplikati_kor_ime.push(d2.kor_ime);
                      if (d2.imejl) duplikati_imejl.push(d2.imejl);
                    }
                    for (let d3 of data3) {
                      if (d3.kor_ime) duplikati_kor_ime.push(d3.kor_ime);
                      if (d3.imejl) duplikati_imejl.push(d3.imejl);
                    }
                    for (let d4 of data4) {
                      if (d4.kor_ime) duplikati_kor_ime.push(d4.kor_ime);
                      if (d4.imejl) duplikati_imejl.push(d4.imejl);
                    }
                    if (duplikati_kor_ime.includes(req.body.kor_ime)) {
                      res.json({
                        poruka: "Greska: korisnicko ime je vec zauzeto",
                      });
                    } else if (duplikati_imejl.includes(req.body.imejl)) {
                      res.json({
                        poruka: "Greska: imejl adresa je vec zauzeta",
                      });
                    } else {
                      this.dodajKonobara(req, res);
                    }
                  })
                  .catch((err) => {
                    console.log(err);
                    res.json(null);
                  });
              })
              .catch((err) => {
                console.log(err);
                res.json(null);
              });
          })
          .catch((err) => {
            console.log(err);
            res.json(null);
          });
      })
      .catch((err) => {
        console.log(err);
        res.json(null);
      });
  };
}
