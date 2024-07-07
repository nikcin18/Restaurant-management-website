import { ObjectId } from 'mongodb';
import mongoose from 'mongoose'

const Schema=mongoose.Schema;

const konobarSchema=new Schema(
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
        restoran:Number, // id restorana
        aktiviran:Number // 1 ili 0
    },{
        versionKey:false
    }
);

export default mongoose.model("KonobarModel",konobarSchema,"konobari");