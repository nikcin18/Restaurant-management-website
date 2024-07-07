import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import restoran from "./restoran";

const Schema = mongoose.Schema;

const ocenaSchema = new Schema(
  {
    _id: ObjectId,
    id: Number, // id rezervacije
    restoran: Number, // id restorana
    gost: String, // ime i prezime gosta
    tekst: String, // Komentar koji da gost
    broj: Number, // Broj koji da gost (1,...,5)
  },
  {
    versionKey: false,
  }
);

export default mongoose.model("OcenaModel", ocenaSchema, "ocene");
