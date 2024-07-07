import { ObjectId } from 'mongodb';
import mongoose from 'mongoose'

const Schema=mongoose.Schema;

const elementKorpeSchema=new Schema(
    {
        _id:ObjectId,
        gost:String, // korisnicko ime gosta
        restoran:Number, // id restorana
        jelo:Number, // id jela
        naziv:String, // naziv jela
        cena:Number, // za 1 kg/L
        kolicina:Number //u kg/L
    },{
        versionKey:false
    }
)

export default mongoose.model("EKModel",elementKorpeSchema,"elementiKorpe");