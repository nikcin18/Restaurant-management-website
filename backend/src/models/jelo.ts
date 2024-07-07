import { ObjectId } from 'mongodb';
import mongoose from 'mongoose'

const Schema=mongoose.Schema;

const jeloSchema=new Schema(
    {
        _id:ObjectId,
        id:Number, // id jela
        naziv:String,
        slika:String,
        cena:Number, // za 1 kg/L
        sastojci:[String],
        restoran:Number // id restorana
    },{
        versionKey:false
    }
);

export default mongoose.model("JeloModel",jeloSchema,"jela");