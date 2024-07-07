import { ObjectId } from 'mongodb';
import mongoose from 'mongoose'

const Schema=mongoose.Schema;

const adminSchema=new Schema(
    {
        _id:ObjectId,
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
        slika:String
    },{
        versionKey:false
    }
);

export default mongoose.model("AdminModel",adminSchema,"administratori");