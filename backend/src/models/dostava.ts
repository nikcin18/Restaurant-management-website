import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const dostavaSchema = new Schema(
  {
    _id: ObjectId,
    id: Number,
    gost: String, // korisnicko ime gosta
    naziv_restorana: String, // naziv restorana
    restoran: Number, // id restorana
    ime_prezime: String, // ime i prezime gosta
    adresa_gosta: String, // adresa gosta
    datum: Number, // broj ms od 1. januara 1970
    sadrzaj: [String], // niz parova jelo - kolicina
    racun: Number, // ukupan iznos racuna
    status: String, // neobradjena, odbijena, potvrdjena
    procenjeno_vreme: Number, // procenjeno vreme dostave u sekundama
  },
  {
    versionKey: false,
  }
);

export default mongoose.model("DostavaModel", dostavaSchema, "dostave");
