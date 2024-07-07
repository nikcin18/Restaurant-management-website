import express, { json } from "express";
import RezervacijaModel from "../models/rezervacija";
import GostModel from "../models/gost";
import KonobarModel from "../models/konobar";
import RestoranModel from "../models/restoran";
import OcenaModel from "../models/ocena";
import { ObjectId, ReturnDocument } from "mongodb";
import restoran from "../models/restoran";
import konobar from "../models/konobar";

export class RezervacijaController {
  dohvatiNeobradjene = (req: express.Request, res: express.Response) => {
    let restoranP = req.params.restoran;

    RezervacijaModel.find({ "restoran": restoranP, "status": "neobradjena" })
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        console.log(err);
        res.json(null);
      });
  };

  dohvatiPrihvacene = (req: express.Request, res: express.Response) => {
    let restoranP = req.params["restoran"];
    let konobarP = req.params["konobar"];
    RezervacijaModel.find({
      "restoran": restoranP,
      "konobar": konobarP,
      "status": { $nin: ["neobradjena", "odbijena"] },
    })
      .then((data) => {
        if (data) res.json(data);
        else res.json(null);
      })
      .catch((err) => {
        console.log(err);
        res.json(null);
      });
  };

  odbijRezervaciju = (req: express.Request, res: express.Response) => {
    let idP = req.body.id;
    let komentarP = req.body.komentar;

    RezervacijaModel.findOneAndUpdate(
      { "id": idP, "status": "neobradjena" },
      { $set: { "status": "odbijena", "komentar": komentarP } }
    )
      .then((data) => {
        if (data) res.json({ poruka: "ok" });
        else res.json({ poruka: "Ne postoji neobradjena rezervacija" });
      })
      .catch((err) => {
        console.log(err);
        res.json({ poruka: "Greska pri radu sa bazom" });
      });
  };

  propustenaRezervacija = (req: express.Request, res: express.Response) => {
    let idP = req.body.id;

    RezervacijaModel.findOneAndUpdate(
      { "id": idP, "status": "u toku" },
      { $set: { "status": "propustena" } }
    )
      .then((data) => {
        if (data) {
          GostModel.findOneAndUpdate(
            { "kor_ime": data.gost },
            { $inc: { "prekrsaji": 1 } }
          )
            .then((ok) => {
              res.json({ poruka: "ok" });
            })
            .catch((err) => {
              res.json({ poruka: "Greska pri radu sa bazom" });
            });
        } else res.json({ poruka: "Ne postoji rezervacija u toku" });
      })
      .catch((err) => {
        res.json({ poruka: "Greska pri radu sa bazom" });
      });
  };

  posecenaRezervacija = (req: express.Request, res: express.Response) => {
    let idP = req.body.id;

    RezervacijaModel.findOneAndUpdate(
      { "id": idP, "status": "u toku" },
      { $set: { "status": "posecena" } }
    )
      .then((data) => {
        if (data) {
          res.json({ poruka: "ok" });
        } else res.json({ poruka: "Ne postoji rezervacija u toku" });
      })
      .catch((err) => {
        res.json({ poruka: "Greska pri radu sa bazom" });
      });
  };

  oceniRezervaciju = async (req: express.Request, res: express.Response) => {
    let idP = req.body.id;
    let tekstP = req.body.tekst;
    let brojP = req.body.broj;
    try {
      let rezervacija = await RezervacijaModel.findOne({
        "id": idP,
        "status": { $in: ["posecena", "produzena"] },
      });
      if (rezervacija == null) {
        res.json({
          poruka: "Ne postoji rezervacija za ocenjivanje sa ID " + idP,
        });
        return;
      }
      if (rezervacija.status == null) {
        res.json({
          poruka: "Neka polja rezervacije su prazna",
        });
        return;
      }
      let statusP = rezervacija.status + " ocenjena";
      RezervacijaModel.updateOne({ "id": idP }, { $set: { "status": statusP } })
        .then((ok) => {
          let novaOcena = {
            _id: new ObjectId(),
            id: idP,
            restoran: rezervacija.restoran,
            gost: rezervacija.ime_prezime,
            tekst: tekstP,
            broj: brojP,
          };
          new OcenaModel(novaOcena)
            .save()
            .then((ok) => {
              res.json({ poruka: "ok" });
            })
            .catch((err) => {
              console.log(err);
              res.json({ poruka: "Greska pri radu sa bazom" });
            });
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

  produziRezervaciju = async (req: express.Request, res: express.Response) => {
    let idP = req.body.id;
    let filter = ["posecena", "posecena ocenjena"];
    try {
      let rezervacija = await RezervacijaModel.findOne({
        "id": idP,
        "status": { $in: filter },
      });
      if (rezervacija == null) {
        res.json({
          poruka: "Ne postoji rezervacija za produzavanje sa ID " + idP,
        });
        return;
      }
      if (
        rezervacija.restoran == null ||
        rezervacija.dan_posete == null ||
        rezervacija.pocetak == null ||
        rezervacija.status == null
      ) {
        res.json({ poruka: "Neka polja rezervacije su prazna" });
        return;
      }
      let restoran = await RestoranModel.findOne({
        "id": rezervacija.restoran,
      });
      if (restoran == null) {
        res.json({
          poruka: "Ne postoji restoran sa ID " + rezervacija.restoran,
        });
        return;
      }
      let dan = rezervacija.dan_posete;
      let pocetak = rezervacija.pocetak;
      let statusP = rezervacija.status.replace("posecena", "produzena");
      if (pocetak >= 23 * 60) dan++;
      pocetak = (pocetak + 60) % (24 * 60);
      let prvi_dan = restoran.radno_vreme[(dan + 3) % 7];
      let drugi_dan = restoran.radno_vreme[(dan + 4) % 7];
      if (!this.unutarRadnogVremena(prvi_dan, drugi_dan, pocetak)) {
        res.json({ poruka: "Produzetak se ne uklapa u radno vreme restorana" });
        return;
      }
      let krajP = pocetak + 3 * 60;
      if (krajP > 24 * 60) krajP = krajP % (24 * 60);
      RezervacijaModel.updateOne(
        { "id": idP },
        { $set: { "status": statusP, "kraj": krajP } }
      )
        .then((ok) => {
          res.json({ poruka: "ok" });
        })
        .catch((err) => {
          res.json({ poruka: "Greska pri radu sa bazom" });
        });
    } catch (err) {
      console.log(err);
      res.json({ poruka: "Greska pri radu sa bazom" });
    }
  };

  otkaziRezervaciju = async (req: express.Request, res: express.Response) => {
    let idP = req.body.rezervacija;
    let sada = req.body.sada;
    try {
      let rezervacija = await RezervacijaModel.findOne({
        "id": idP,
        "status": "u toku",
      });
      if (rezervacija == null) {
        res.json({
          poruka: "Ne postoji rezervacija za otkazivanje sa ID " + idP,
        });
        return;
      }
      if (rezervacija.dan_posete == null || rezervacija.pocetak == null) {
        res.json({ poruka: "Neka polja rezervacije su prazna" });
        return;
      }
      if (rezervacija.dan_posete * 24 * 60 + rezervacija.pocetak - sada < 45) {
        res.json({ poruka: "Rezervacija ne moze da se otkaze ovako kasno" });
        return;
      }
      RezervacijaModel.updateOne(
        { "id": idP },
        { $set: { "status": "otkazana" } }
      )
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

  uMesecDana(datum1: Date, datum2: Date) {
    //datum 'datum1' prethodi datumu 'datum2'
    let g1 = datum1.getFullYear(),
      g2 = datum2.getFullYear();
    let m1 = datum1.getMonth() + 1,
      m2 = datum2.getMonth() + 1;
    let str1 = datum1.toISOString().substring(8, 18);
    let str2 = datum2.toISOString().substring(8, 18);
    if (g1 < g2 - 1) return false;
    if (g1 == g2 - 1) {
      if (m1 < 12 || m2 > 1) return false;
      return str1 >= str2;
    }
    if (m1 < m2 - 1) return false;
    if (m1 == m2) return true;
    return str1 >= str2;
  }

  uDveGodine(datum1: Date, datum2: Date) {
    //datum 'datum1' prethodi datumu 'datum2'
    let g1 = datum1.getFullYear();
    let g2 = datum2.getFullYear();
    let str1 = datum1.toISOString().substring(4, 18);
    let str2 = datum2.toISOString().substring(4, 18);
    if (g1 < g2 - 2) return false;
    if (g1 > g2 - 2) return true;
    return str1 >= str2;
  }

  dohvatiStatistikuPocetna = async (
    req: express.Request,
    res: express.Response
  ) => {
    let broj24h = 0;
    let broj7d = 0;
    let broj1m = 0;
    let filter = ["neobradjena", "odbijena", "otkazana"];
    let sada = Number.parseInt(req.params["sada"]);
    let minut = 60 * 1000;
    let dan = 24 * 60 * minut;
    try {
      let rezervacije = await RezervacijaModel.find({
        "status": { $nin: filter },
      });
      for (let r of rezervacije) {
        if (r.datum_prijave == null) continue;
        if (sada - r.datum_prijave <= dan) broj24h++;
        if (sada - r.datum_prijave <= 7 * dan) broj7d++;
        if (this.uMesecDana(new Date(r.datum_prijave), new Date(sada)))
          broj1m++;
      }
      res.json([broj24h, broj7d, broj1m]);
    } catch (err) {
      console.log(err);
      res.json([-1, -1, -1]);
    }
  };

  dohvatiStatistikuDani = async (
    req: express.Request,
    res: express.Response
  ) => {
    let restoranP = Number.parseInt(req.params["restoran"]);
    let konobarP = req.params["konobar"];
    let dani = [0, 0, 0, 0, 0, 0, 0];
    let filter = ["neobradjena", "odbijena", "otkazana"];
    let granicnaVrednost = 30;
    try {
      let rezervacije = await RezervacijaModel.find({
        "status": { $nin: filter },
        "konobar": konobarP,
        "restoran": restoranP,
      });
      for (let r of rezervacije) {
        if (r.dan_posete == undefined || r.broj_ljudi == undefined) continue;
        if (r.pocetak == null) continue;
        let dan_posete = r.dan_posete;
        let broj_ljudi = r.broj_ljudi;
        dani[(dan_posete + 3) % 7]+=broj_ljudi;
      }
      res.json(dani);
    } catch (err) {
      console.log(err);
      res.json([-1]);
    }
  };

  dohvatiStatistikuKonobari = async (
    req: express.Request,
    res: express.Response
  ) => {
    let restoranP = Number.parseInt(req.params["restoran"]);
    let filter = ["neobradjena", "odbijena", "otkazana"];
    try {
      let konobari = await KonobarModel.find({ "restoran": restoranP }).select({
        "kor_ime": 1,
        "ime": 1,
        "prezime": 1,
        "_id": 0,
      });
      const podaci = await RezervacijaModel.aggregate([
        {
          $match: {
            "restoran": restoranP,
            "status": { $nin: filter },
          },
        },
        { $group: { _id: "$konobar", count: { $sum: "$broj_ljudi" } } },
      ]);
      let rezultat = <
        { kor_ime: string; ime_prezime: string; broj: number }[]
      >[];
      for (let p of podaci) {
        for (let k of konobari) {
          if (p._id == k.kor_ime && k.kor_ime) {
            rezultat.push({
              kor_ime: k.kor_ime,
              ime_prezime: k.ime + " " + k.prezime,
              broj: p.count,
            });
          }
        }
      }
      res.json(rezultat);
    } catch (err) {
      console.log(err);
      res.json([]);
    }
  };

  dohvatiStatistikuProsek = async (
    req: express.Request,
    res: express.Response
  ) => {
    let restoranP = Number.parseInt(req.params["restoran"]);
    let konobarP = req.params["konobar"];
    let dani = [0, 0, 0, 0, 0, 0, 0];
    let filter = ["neobradjena", "odbijena", "otkazana"];
    let sada = Date.now();
    let dan = 24 * 3600 * 1000;
    let minut = 60 * 1000;
    try {
      let rezervacije = await RezervacijaModel.find({
        "status": { $nin: filter },
        "restoran": restoranP,
        "konobar": konobarP,
      });
      for (let r of rezervacije) {
        if (r.dan_posete == null || r.pocetak==null) continue;
        let datum = new Date(r.dan_posete*dan+r.pocetak*minut);
        if (this.uDveGodine(datum, new Date(sada))) {
          dani[(r.dan_posete + 3) % 7]++;
        }
      }
      res.json(dani);
    } catch (err) {
      console.log(err);
      res.json([]);
    }
  };

  nadjiSto1 = async (
    zahtev: any,
    gost: any,
    restoran: any,
    res: express.Response
  ) => {
    let stolovi = <any[]>[];
    const filter = ["neobradjena", "odbijena", "propustena"];
    for (let i = 0; i < restoran.raspored.stolovi.length; i++) {
      let sto = restoran.raspored.stolovi[i];
      if (sto.kap >= zahtev.broj_ljudi) {
        stolovi.push({ broj: i, sto: sto });
      }
    }
    if (stolovi.length == 0) {
      res.json({ poruka: "Ne postoji dovoljno veliki sto za sve osobe" });
      return;
    }
    try {
      let rezervacije = await RezervacijaModel.find({
        "restoran": restoran.id,
        "dan_posete": {
          $gte: zahtev.dan_posete - 1,
          $lte: zahtev.dan_posete + 1,
        },
        "status": { $nin: filter },
      });
      let p1 = zahtev.dan_posete * 24 * 60 + zahtev.pocetak;
      let k1 = p1 + 3 * 60;
      for (let r of rezervacije) {
        if (
          r.pocetak == null ||
          r.kraj == null ||
          r.dan_posete == null ||
          r.status
        )
          continue;
        let p2 = r.dan_posete * 24 * 60 + r.pocetak;
        let k2 =
          p2 +
          (r.status == "produzena" || r.status == "produzena ocenjena"
            ? 240
            : 180);
        if (k1 <= p2 || p1 >= k2) continue;
        stolovi = stolovi.filter((data) => {
          return data.broj != r.sto;
        });
      }
      if (stolovi.length == 0) {
        res.json({ poruka: "Ne postoji slobodan sto za trazeni termin" });
        return;
      }
      let temp = await RezervacijaModel.find({}).sort({ "id": -1 }).limit(1);
      let maxId = temp.length > 0 ? temp[0].id : 0;
      let krajZ = zahtev.pocetak + 3 * 60;
      if (krajZ > 24 * 60) krajZ = krajZ % (24 * 60);
      let novaRezervacija = {
        _id: new ObjectId(),
        id: maxId + 1,
        datum_prijave: zahtev.datum_prijave,
        dan_posete: zahtev.dan_posete,
        pocetak: zahtev.pocetak,
        kraj: krajZ,
        gost: gost.kor_ime,
        restoran: restoran.id,
        ime_prezime: gost.ime + " " + gost.prezime,
        naziv_restorana: restoran.naziv,
        adresa_restorana: restoran.adresa,
        sto: -1,
        broj_ljudi: zahtev.broj_ljudi,
        komentar: "",
        status: "neobradjena",
        konobar: "",
        zahtevi: zahtev.zahtevi,
      };
      new RezervacijaModel(novaRezervacija)
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

  unutarRadnogVremena(
    prvi_dan: number[][],
    drugi_dan: number[][],
    pocetak: number
  ) {
    let kraj = pocetak + 3 * 60;
    if (kraj <= 24 * 60) {
      for (let interval of prvi_dan) {
        if (interval[0] <= pocetak && kraj <= interval[1]) {
          return true;
        }
      }
      return false;
    } else {
      kraj = kraj % (24 * 60);
      let l1 = prvi_dan.length;
      if (prvi_dan[l1 - 1][1] < 24 * 60 || prvi_dan[l1 - 1][0] > pocetak)
        return false;
      let l2 = drugi_dan.length;
      if (l2 == 0 || drugi_dan[0][0] > 0 || drugi_dan[0][1] < kraj)
        return false;
      return true;
    }
  }

  posaljiRezervaciju1 = async (req: express.Request, res: express.Response) => {
    let zahtev = req.body;
    try {
      let gost = await GostModel.findOne({ "kor_ime": zahtev.gost });
      if (gost == null) {
        res.json({ poruka: "Gost ne postoji" });
        return;
      }
      if (gost.prekrsaji && gost.prekrsaji >= 3) {
        res.json({ poruka: "Nemate dozvolu da pravite nove rezervacije" });
        return;
      }
      let restoran = await RestoranModel.findOne({ "id": zahtev.restoran });
      if (restoran == null) {
        res.json({ poruka: "Restoran ne postoji" });
        return;
      }
      let dan = (zahtev.dan_posete + 3) % 7;
      let pocetak = zahtev.pocetak;
      let radni_dan = restoran.radno_vreme[dan];
      if (radni_dan.length == 0) {
        res.json({ poruka: "Restoran ne radi taj dan" });
        return;
      }
      if (
        !this.unutarRadnogVremena(
          restoran.radno_vreme[dan],
          restoran.radno_vreme[(dan + 1) % 7],
          pocetak
        )
      ) {
        res.json({
          poruka: "Trazeni termin je van radnog vremena restorana",
        });
        return;
      }
      this.nadjiSto1(zahtev, gost, restoran, res);
    } catch (err) {
      console.log(err);
      res.json({ poruka: "Greska pri radu sa bazom" });
    }
  };

  dohvatiRezervacijeGost = (req: express.Request, res: express.Response) => {
    const filter = <string[]>[];
    RezervacijaModel.find({
      "gost": req.params["gost"],
      "status": { $nin: filter },
    })
      .then((rezervacije) => {
        res.json(rezervacije);
      })
      .catch((err) => {
        console.log(err);
        res.json(null);
      });
  };

  dohvatiZauzeteStoloveGost = async (
    req: express.Request,
    res: express.Response
  ) => {
    let gostP = req.params["gost"];
    let restoranP = Number.parseInt(req.params["restoran"]);
    let dan_poseteP = Number.parseInt(req.params["dan_posete"]);
    let pocetakP = Number.parseInt(req.params["pocetak"]);
    const filter = ["neobradjena", "odbijena", "propustena"];
    try {
      let gost = await GostModel.findOne({ "kor_ime": gostP });
      if (gost == null || gost.prekrsaji == null || gost.prekrsaji >= 3) {
        res.json([-4]);
        return;
      }
      let restoran = await RestoranModel.findOne({ "id": restoranP });
      if (
        restoran == null ||
        restoran.raspored == null ||
        restoran.radno_vreme == null
      ) {
        res.json([-1]);
        return;
      }
      let dan = (dan_poseteP + 3) % 7;
      if (restoran.radno_vreme[dan].length == 0) {
        res.json([-2]);
        return;
      }
      let prvi_dan = restoran.radno_vreme[dan];
      let drugi_dan = restoran.radno_vreme[(dan + 1) % 7];
      if (!this.unutarRadnogVremena(prvi_dan, drugi_dan, pocetakP)) {
        res.json([-3]);
        return;
      }
      let zauzeti = <number[]>[];
      let rezervacije = await RezervacijaModel.find({
        "restoran": restoran.id,
        "dan_posete": {
          $gte: dan_poseteP - 1,
          $lte: dan_poseteP + 1,
        },
        "status": { $nin: filter },
      });
      let p1 = dan_poseteP * 24 * 60 + pocetakP;
      let k1 = p1 + 180;
      for (let r of rezervacije) {
        if (r.dan_posete == null || r.pocetak == null) continue;
        if (r.sto == null || r.sto == -1) continue;
        let p2 = r.dan_posete * 24 * 60 + r.pocetak;
        let k2 =
          p2 +
          (r.status == "produzena" || r.status == "produzena ocenjena"
            ? 240
            : 180);
        if (k1 <= p2 || p1 >= k2) continue;
        if (!zauzeti.includes(r.sto)) {
          zauzeti.push(r.sto);
        }
      }
      res.json(zauzeti);
    } catch (err) {
      console.log(err);
      res.json([-1]);
    }
  };

  dohvatiZauzeteStoloveKonobar = async (
    req: express.Request,
    res: express.Response
  ) => {
    let restoranP = Number.parseInt(req.params["restoran"]);
    let dan_poseteP = Number.parseInt(req.params["dan_posete"]);
    let pocetakP = Number.parseInt(req.params["pocetak"]);
    const filter = ["neobradjena", "odbijena", "propustena"];
    try {
      let restoran = await RestoranModel.findOne({ "id": restoranP });
      if (
        restoran == null ||
        restoran.raspored == null ||
        restoran.radno_vreme == null
      ) {
        res.json([-1]);
        return;
      }
      let dan = (dan_poseteP + 3) % 7;
      if (restoran.radno_vreme[dan].length == 0) {
        res.json([-2]);
        return;
      }
      let prvi_dan = restoran.radno_vreme[dan];
      let drugi_dan = restoran.radno_vreme[(dan + 1) % 7];
      if (!this.unutarRadnogVremena(prvi_dan, drugi_dan, pocetakP)) {
        res.json([-3]);
        return;
      }
      let zauzeti = <number[]>[];
      let rezervacije = await RezervacijaModel.find({
        "restoran": restoran.id,
        "dan_posete": {
          $gte: dan_poseteP - 1,
          $lte: dan_poseteP + 1,
        },
        "status": { $nin: filter },
      });
      let p1 = dan_poseteP * 24 * 60 + pocetakP;
      let k1 = p1 + 180;
      for (let r of rezervacije) {
        if (r.dan_posete == null || r.pocetak == null) continue;
        if (r.sto == null || r.sto == -1) continue;
        let p2 = r.dan_posete * 24 * 60 + r.pocetak;
        let k2 =
          p2 +
          (r.status == "produzena" || r.status == "produzena ocenjena"
            ? 240
            : 180);
        if (k1 <= p2 || p1 >= k2) continue;
        if (!zauzeti.includes(r.sto)) {
          zauzeti.push(r.sto);
        }
      }
      res.json(zauzeti);
    } catch (err) {
      console.log(err);
      res.json([-1]);
    }
  };

  posaljiRezervaciju2 = async (req: express.Request, res: express.Response) => {
    let zahtev = req.body;
    try {
      let gost = await GostModel.findOne({ "kor_ime": zahtev.gost });
      if (gost == null) {
        res.json({ poruka: "Gost ne postoji" });
        return;
      }
      if (gost.prekrsaji && gost.prekrsaji >= 3) {
        res.json({ poruka: "Nemate dozvolu da pravite nove rezervacije." });
        return;
      }
      let temp = await RezervacijaModel.find({}).sort({ "id": -1 }).limit(1);
      let maxId = temp.length > 0 ? temp[0].id : 0;
      let krajP = zahtev.pocetak + 180;
      if (krajP > 24 * 60) krajP = krajP % (24 * 60);
      let novaRezervacija = {
        _id: new ObjectId(),
        id: maxId + 1,
        datum_prijave: zahtev.datum_prijave,
        dan_posete: zahtev.dan_posete,
        pocetak: zahtev.pocetak,
        kraj: krajP,
        gost: gost.kor_ime,
        restoran: zahtev.restoran,
        ime_prezime: gost.ime + " " + gost.prezime,
        naziv_restorana: zahtev.naziv_restorana,
        adresa_restorana: zahtev.adresa_restorana,
        sto: zahtev.sto,
        broj_ljudi: zahtev.broj_ljudi,
        komentar: "",
        status: "neobradjena",
        konobar: "",
        zahtevi: zahtev.zahtevi,
      };

      new RezervacijaModel(novaRezervacija)
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

  async proveriSlobodanSto(
    restoranP: number,
    stoP: number,
    danP: number,
    pocetakP: number
  ) {
    let filter = ["neobradjena", "odbijena", "propustena"];
    try {
      let rezervacije = await RezervacijaModel.find({
        "restoran": restoranP,
        "sto": stoP,
        "status": { $nin: filter },
        "dan_posete": { $gte: danP - 1, $lte: danP + 1 },
      });
      let p1 = danP * 24 * 60 + pocetakP;
      let k1 = p1 + 3 * 60;
      for (let r of rezervacije) {
        if (r.dan_posete == null || r.pocetak == null || r.status) continue;
        let p2 = r.dan_posete * 24 * 60 + r.pocetak;
        let k2 =
          p2 +
          (r.status == "produzena" || r.status == "produzena ocenjena"
            ? 240
            : 180);
        if (k1 <= p2 || p1 >= k2) continue;
        return false;
      }
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  prihvatiRezervaciju = async (req: express.Request, res: express.Response) => {
    let idP = req.body.id;
    let konobarP = req.body.konobar;
    let stoP = <number>req.body.sto;
    try {
      let rezervacija = await RezervacijaModel.findOne({
        "id": idP,
        "status": "neobradjena",
      });
      if (rezervacija == null) {
        res.json({
          poruka: "Ne postoji neobradjena rezervacija ciji je ID" + idP,
        });
        return;
      }
      if (
        rezervacija.restoran == null ||
        rezervacija.dan_posete == null ||
        rezervacija.pocetak == null ||
        rezervacija.gost == null
      ) {
        res.json({
          poruka: "Prazna polja u rezervaciji",
        });
        return;
      }
      let gost = await GostModel.findOne({ "kor_ime": rezervacija.gost });
      if (gost == null) {
        res.json({
          poruka: "Ne postoji gost",
        });
        return;
      }
      if (gost.aktiviran == null || gost.aktiviran == 0) {
        res.json({
          poruka: "Gost nije aktiviran. Obratite se administratoru",
        });
        return;
      }
      if (gost.prekrsaji == null || gost.prekrsaji >= 3) {
        res.json({
          poruka: "Gost je blokiran",
        });
        return;
      }
      let restoran = await RestoranModel.findOne({
        "id": rezervacija.restoran,
      });
      if (restoran == null) {
        res.json({
          poruka: "Ne postoji restoran",
        });
        return;
      }
      if (
        rezervacija.broj_ljudi == null ||
        restoran.raspored == null ||
        restoran.raspored.stolovi == null ||
        stoP == null
      ) {
        console.log("Prazna polja vezana za broj ljudi");
        res.json({
          poruka: "Greska pri radu sa bazom",
        });
        return;
      }
      let kap = restoran.raspored.stolovi[stoP].kap;
      if (rezervacija.broj_ljudi > (kap ? kap : 0)) {
        res.json({
          poruka: "Izabrani sto nije dovoljno veliki za sve goste",
        });
        return;
      }
      if (
        !this.proveriSlobodanSto(
          rezervacija.restoran,
          stoP,
          rezervacija.dan_posete,
          rezervacija.pocetak
        )
      ) {
        res.json({
          poruka: "Izabrani sto nije vise slobodan",
        });
        return;
      }
      RezervacijaModel.updateOne(
        { "id": idP },
        { $set: { "konobar": konobarP, "sto": stoP, "status": "u toku" } }
      )
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
}
