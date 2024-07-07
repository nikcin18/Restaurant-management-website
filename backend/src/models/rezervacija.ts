import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const rezervacijaSchema = new Schema(
  {
    _id: ObjectId,
    id: Number, // id rezervacije
    datum_prijave: Number, // Broj milisekundi od 1. januara 1970
    dan_posete: Number, // Broj dana od 1. januara 1970
    pocetak: Number, // broj minuta od ponoci
    kraj: Number, // broj minuta od ponoci
    gost: String, // korisnicko ime gosta
    restoran: Number, // id restorana
    ime_prezime: String, // ime i prezime gosta
    naziv_restorana: String,
    adresa_restorana: String,
    sto: Number, // redni broj stola
    broj_ljudi: Number,
    komentar: String, // daje konobar pri odbijanju rezervacije
    status: String,
    /* neobradjena, odbijena, u toku, otkazana, propustena, posecena, produzena,
    posecena ocenjena, produzena ocenjena*/
    konobar: String, // korisnicko ime konobara
    zahtevi: String, // posebni zahtevi gosta
  },
  {
    versionKey: false,
  }
);

export default mongoose.model(
  "RezervacijaModel",
  rezervacijaSchema,
  "rezervacije"
);
