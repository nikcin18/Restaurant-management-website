import express, { json } from "express";
import GostModel from "../models/gost";
import KonobarModel from "../models/konobar";
import AdminModel from "../models/admin";
import { ObjectId } from "mongodb";

export class GostController {
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
    GostModel.findOne({ "kor_ime": kor_imeP })
      .then((data) => {
        if (data && data.lozinka) {
          if (this.dekriptujLozinku(data.lozinka) == lozinkaP) {
            data.lozinka = "";
            if (data.aktiviran == 0) {
              res.json({ aktiviran: 0 });
            } else res.json(data);
          } else res.json(null);
        } else res.json(null);
      })
      .catch((err) => {
        console.log(err);
        res.json(null);
      });
  };

  dohvatiGosta = (req: express.Request, res: express.Response) => {
    GostModel.findOne({ "kor_ime": req.params.kor_ime })
      .then((data) => {
        if (data) {
          data.lozinka = "";
          data.bezb_pitanje = "";
          data.bezb_odgovor = "";
          data.kartica = "";
          res.json(data);
        } else res.json(null);
      })
      .catch((err) => {
        console.log(err);
        res.json(null);
      });
  };

  dohvatiSveGoste = (req: express.Request, res: express.Response) => {
    GostModel.find({})
      .then((data) => {
        if (data) {
          for (let d of data) {
            d.lozinka = "";
            d.bezb_pitanje = "";
            d.bezb_odgovor = "";
            d.kartica = "";
          }
        }
        res.json(data);
      })
      .catch((err) => {
        console.log(err);
        res.json(null);
      });
  };

  aktivirajGosta = (req: express.Request, res: express.Response) => {
    GostModel.findOneAndUpdate(
      { "kor_ime": req.body.kor_ime },
      { $set: { "aktiviran": 1 } }
    )
      .then((data) => {
        if (data) res.json({ poruka: "Gost je uspesno aktiviran" });
        else res.json({ poruka: "Greska pri radu sa bazom" });
      })
      .catch((err) => {
        console.log(err);
        res.json({ poruka: "Greska pri radu sa bazom" });
      });
  };

  deaktivirajGosta = (req: express.Request, res: express.Response) => {
    GostModel.findOneAndUpdate(
      { "kor_ime": req.body.kor_ime },
      { $set: { "aktiviran": 0 } }
    )
      .then((data) => {
        if (data) res.json({ poruka: "Gost je uspesno deaktiviran" });
        else res.json({ poruka: "Greska pri radu sa bazom" });
      })
      .catch((err) => {
        console.log(err);
        res.json({ poruka: "Greska pri radu sa bazom" });
      });
  };

  odblokirajGosta = (req: express.Request, res: express.Response) => {
    GostModel.findOneAndUpdate(
      { "kor_ime": req.body.kor_ime },
      { $set: { "prekrsaji": 0 } }
    )
      .then((data) => {
        if (data) res.json({ poruka: "Gost je uspesno odblokiran" });
        else res.json({ poruka: "Greska pri radu sa bazom" });
      })
      .catch((err) => {
        console.log(err);
        res.json({ poruka: "Greska pri radu sa bazom" });
      });
  };

  blokirajGosta = (req: express.Request, res: express.Response) => {
    GostModel.findOneAndUpdate(
      { "kor_ime": req.body.kor_ime },
      { $inc: { "prekrsaji": -100000 } }
    )
      .then((data) => {
        if (data) res.json({ poruka: "Gost je uspesno blokiran" });
        else res.json({ poruka: "Greska pri radu sa bazom" });
      })
      .catch((err) => {
        console.log(err);
        res.json({ poruka: "Greska pri radu sa bazom" });
      });
  };

  promeniLozinku = (req: express.Request, res: express.Response) => {
    let kor_ime = req.body.kor_ime;
    let stara_lozinka = req.body.stara_lozinka;
    let nova_lozinka = req.body.nova_lozinka;
    GostModel.findOneAndUpdate(
      {
        "kor_ime": kor_ime,
        "lozinka": this.kriptujLozinku(stara_lozinka),
        "aktiviran": 1,
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
    GostModel.findOneAndUpdate(
      { "kor_ime": kor_ime, "bezb_odgovor": bezb_odgovor, "aktiviran": 1 },
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
    GostModel.findOne({ "kor_ime": kor_ime, "aktiviran": 1 })
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
    GostModel.findOne({
      "kor_ime": kor_ime,
      "aktiviran": 1,
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

  dohvatiBrojGostiju = (req: express.Request, res: express.Response) => {
    GostModel.find({})
      .then((data) => {
        if (data) {
          res.json(data.length);
        } else res.json(0);
      })
      .catch((err) => {
        console.log(err);
        res.json(0);
      });
  };

  promeniImejl = async (req: express.Request, res: express.Response) => {
    let kor_imeP = req.body.kor_ime;
    let imejlP = req.body.imejl;
    try {
      let gost = await GostModel.findOne({ "kor_ime": kor_imeP });
      if (gost == null) {
        res.json({ poruka: "ne postoji" });
        return;
      }
      if (gost.imejl == imejlP) {
        res.json({ poruka: imejlP });
        return;
      }
      let duplikatG = await GostModel.findOne({ "imejl": imejlP });
      if (duplikatG != null) {
        res.json({ poruka: "duplikat" });
        return;
      }
      let duplikatK = await KonobarModel.findOne({ "imejl": imejlP });
      if (duplikatK != null) {
        res.json({ poruka: "duplikat" });
        return;
      }
      let duplikatA = await AdminModel.findOne({ "imejl": imejlP });
      if (duplikatA != null) {
        res.json({ poruka: "duplikat" });
        return;
      }
      GostModel.updateOne(
        { "kor_ime": kor_imeP },
        { $set: { "imejl": imejlP } }
      )
        .then((ok) => {
          res.json({ poruka: imejlP });
        })
        .catch((err) => {
          console.log(err);
          res.json({ poruka: "greska" });
        });
    } catch (err) {
      console.log(err);
      res.json({ poruka: "greska" });
    }
  };

  azurirajNalog = (req: express.Request, res: express.Response) => {
    let kor_imeP = req.body.kor_ime;
    let slika = req.body.slika;
    let ime = req.body.ime;
    let prezime = req.body.prezime;
    let adresa = req.body.adresa;
    let telefon = req.body.telefon;
    let kartica = req.body.kartica;
    GostModel.findOneAndUpdate(
      { "kor_ime": kor_imeP },
      {
        $set: {
          "slika": slika,
          "ime": ime,
          "prezime": prezime,
          "adresa": adresa,
          "telefon": telefon,
          "kartica": kartica,
        },
      }
    )
      .then((data) => {
        if (data) {
          res.json(req.body);
        } else res.json(null);
      })
      .catch((err) => {
        console.log(err);
        res.json(null);
      });
  };
}
