import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const krugSchema = new Schema({
  x: Number,
  y: Number,
  r: Number,
  kap: Number,
});

const kvadratSchema = new Schema({
  x1: Number,
  y1: Number,
  x2: Number,
  y2: Number,
});

const rasporedSchema = new Schema({
  stolovi: [krugSchema],
  kuhinje: [kvadratSchema],
  toaleti: [kvadratSchema],
  visina: Number,
  sirina: Number,
});

const restoranSchema = new Schema(
  {
    _id: ObjectId,
    id: Number,
    naziv: String,
    tip: String,
    adresa: String,
    opis: String,
    kontakt: String,
    raspored: rasporedSchema,
    radno_vreme: Array, // matrica [7][*][2] sa brojevima minuta od ponoci
  },
  {
    versionKey: false,
  }
);

export default mongoose.model("RestoranModel", restoranSchema, "restorani");
