import { ObjectId } from 'mongodb';
import mongoose from 'mongoose'

const Schema=mongoose.Schema;

const gostSchema=new Schema(
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
        slika:String,
        kartica:String,
        aktiviran:Number,   // 1 ili 0
        prekrsaji:Number    // broj izmedju 0 i 2 znaci da nije blokiran
    },{
        versionKey:false
    }
);

export default mongoose.model("GostModel",gostSchema,"gosti");