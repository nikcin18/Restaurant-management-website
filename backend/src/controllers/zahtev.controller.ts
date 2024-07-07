import express, { json } from 'express'
import ZahtevModel from '../models/zahtev'
import GostModel from '../models/gost'
import KonobarModel from '../models/konobar'
import AdminModel from '../models/admin'
import { ObjectId } from 'mongodb';

export class ZahtevController {
    powerMod = (base: number, exp: number, mod: number) => {
        let res = 1;
        let mul = base % mod;
        let e = 1;
        while (e <= exp) {
            if (e & exp) res = res * mul % mod;
            e *= 2;
            mul = mul * mul % mod;
        }
        return res;
    }

    kriptujLozinku = (plaintext: string) => {
        const n = 95, e = 29, d = 5;
        let filler = 0;
        for (let i = 0; i < plaintext.length; i++) {
            filler = (filler + plaintext.charCodeAt(i) - 32);
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
    }

    dekriptujLozinku = (ciphertext: string) => {
        const n = 95, e = 29, d = 5;
        let ind = ciphertext.charCodeAt(0) - 32;
        let l = this.powerMod(ind, d, n);
        let f = ciphertext.length - l;
        let plaintext = "";
        for (let i = ciphertext.length - 1; i >= f; i--) {
            ind = (ciphertext.charCodeAt(i) - 32);
            let k = (this.powerMod(ind, d, n) + 95 - 7) % 95;
            plaintext += String.fromCharCode(k + 32);
        }
        return plaintext;
    }

    dodajZahtev = (req: express.Request, res: express.Response) => {
        let id = 0;
        ZahtevModel.find({}).sort({ "id": -1 }).limit(1).then(data => {
            if (data.length > 0) {
                id = data[0].id;
            }
            let zahtev = req.body;
            zahtev._id = new ObjectId();
            zahtev.id = id + 1;
            zahtev.lozinka = this.kriptujLozinku(zahtev.lozinka);
            zahtev.status = "neobradjen";
            new ZahtevModel(zahtev).save().then(data => {
                res.json({ poruka: "ok" });
            }).catch(err => {
                res.json({ poruka: "Greska pri radu sa bazom podataka: " + err });
            });
        }
        ).catch(err => {
            res.json({ poruka: "Greska pri radu sa bazom podataka: " + err });
        })
    }

    noviZahtev = (req: express.Request, res: express.Response) => {
        GostModel.find({}).then(data1 => {
            KonobarModel.find({}).then(data2 => {
                AdminModel.find({}).then(data3 => {
                    ZahtevModel.find({ "status": "odbijen" }).then(data4 => {
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
                            res.json({ poruka: "Greska: korisnicko ime je vec zauzeto" });
                        }
                        else if (duplikati_imejl.includes(req.body.imejl)) {
                            res.json({ poruka: "Greska: imejl adresa je vec zauzeta" });
                        }
                        else {
                            this.dodajZahtev(req, res);
                        }
                    }).catch(err => {
                        console.log(err);
                        res.json(null);
                    })
                }).catch(err => {
                    console.log(err);
                    res.json(null);
                })
            }).catch(err => {
                console.log(err);
                res.json(null);
            })
        }).catch(err => {
            console.log(err);
            res.json(null);
        })
    }


    dohvatiNeobradjeneZahteve = (req: express.Request, res: express.Response) => {
        ZahtevModel.find({ "status": "neobradjen" }).then(
            data => {
                if (data) {
                    for (let d of data) {
                        d.lozinka = "";
                        d.kartica = "";
                    }
                }
                res.json(data);
            }
        ).catch(err => {
            res.json(null);
        })
    }

    dohvatiSveZahteve = (req: express.Request, res: express.Response) => {
        ZahtevModel.find({}).then(
            data => {
                if (data) {
                    for (let d of data) {
                        d.lozinka = "";
                        d.kartica = "";
                    }
                }
                res.json(data);
            }
        ).catch(err => {
            res.json(null);
        })
    }

    prihvatiZahtev = (req: express.Request, res: express.Response) => {
        let id = req.body.id;
        let filter = ["odbijen", "prihvacen"]
        GostModel.find({}).then(data1 => {
            KonobarModel.find({}).then(data2 => {
                AdminModel.find({}).then(data3 => {
                    ZahtevModel.find({ "status": { $in: filter } }).then(data4 => {
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
                            this.dohvatiSveZahteve(req, res);
                        }
                        else if (duplikati_imejl.includes(req.body.imejl)) {
                            this.dohvatiSveZahteve(req, res);
                        }
                        else {
                            ZahtevModel.findOneAndUpdate({ "id": id, "status": "neobradjen" }, { $set: { "status": "prihvacen" } })
                                .then(zahtev => {
                                    if (zahtev) {
                                        let kor_ime = zahtev.kor_ime;
                                        let imejl = zahtev.imejl;
                                        ZahtevModel.updateMany({ $or: [{ "kor_ime": kor_ime }, { "imejl": imejl }], "status": "neobradjen" }, { $set: { "status": "duplikat" } }).then(data => {
                                            let gost = {
                                                _id: new ObjectId(),
                                                kor_ime: zahtev.kor_ime,
                                                lozinka: zahtev.lozinka,
                                                bezb_pitanje: zahtev.bezb_pitanje,
                                                bezb_odgovor: zahtev.bezb_odgovor,
                                                ime: zahtev.ime,
                                                prezime: zahtev.prezime,
                                                pol: zahtev.pol,
                                                adresa: zahtev.adresa,
                                                telefon: zahtev.telefon,
                                                imejl: zahtev.imejl,
                                                slika: zahtev.slika,
                                                kartica: zahtev.kartica,
                                                aktiviran: 1,
                                                prekrsaji: 0
                                            }
                                            new GostModel(gost).save().then(data => {
                                                this.dohvatiSveZahteve(req, res);
                                            }).catch(err => {
                                                this.dohvatiSveZahteve(req, res);
                                            })
                                        }).catch(err => {
                                            this.dohvatiSveZahteve(req, res);
                                        })
                                    }
                                    else {
                                        this.dohvatiSveZahteve(req, res);
                                    }
                                }).catch(err => {
                                    this.dohvatiSveZahteve(req, res);
                                })
                        }
                    }).catch(err => {
                        console.log(err);
                        this.dohvatiSveZahteve(req, res);
                    })
                }).catch(err => {
                    console.log(err);
                    this.dohvatiSveZahteve(req, res);
                })
            }).catch(err => {
                console.log(err);
                this.dohvatiSveZahteve(req, res);
            })
        }).catch(err => {
            console.log(err);
            this.dohvatiSveZahteve(req, res);
        })


    }

    odbijZahtev = (req: express.Request, res: express.Response) => {
        let id = req.body.id;
        ZahtevModel.findOneAndUpdate({ "id": id, "status": "neobradjen" }, { $set: { "status": "odbijen" } })
            .then(zahtev => {
                if (zahtev) {
                    let kor_ime = zahtev.kor_ime;
                    let imejl = zahtev.imejl;
                    ZahtevModel.updateMany({ $or: [{ "kor_ime": kor_ime }, { "imejl": imejl }], "status": "neobradjen" }, { $set: { "status": "duplikat" } }).then(data => {
                        this.dohvatiSveZahteve(req, res);
                    }).catch(err => {
                        this.dohvatiSveZahteve(req, res);
                    })
                }
                else {
                    this.dohvatiSveZahteve(req, res);
                }
            }).catch(err => {
                this.dohvatiSveZahteve(req, res);
            })
    }
};