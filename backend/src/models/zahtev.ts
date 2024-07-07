import { ObjectId } from 'mongodb';
import mongoose from 'mongoose'

const Schema=mongoose.Schema;

const zahtevSchema=new Schema(
    {
        _id:ObjectId,
        id:Number,
        kor_ime:String,
        lozinka:String,
        bezb_pitanje:String,
        bezb_odgovor:String,
        ime:String,
        prezime:String,
        pol:String,
        adresa:String,
        telefon:String,
        imejl:String,
        slika:String,
        kartica:String,
        status:String
    },{
        versionKey:false
    }
);

export default mongoose.model("ZahtevModel",zahtevSchema,"zahtevi");