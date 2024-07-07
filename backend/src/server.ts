import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import gostRouter from './routers/gost.router';
import konobarRouter from './routers/konobar.router';
import adminRouter from './routers/admin.router';
import zahtevRouter from './routers/zahtev.router';
import restoranRouter from './routers/restoran.router';
import rezervacijaRouter from './routers/rezervacija.router';
import jeloRouter from './routers/jelo.router';
import dostavaRouter from './routers/dostava.router';

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/projekatDB");
const conn=mongoose.connection;
conn.once("open",()=>{
    console.log("uspesno povezivanje sa bazom 'restoraniDB'");
})

const router=express.Router();
router.use("/gosti",gostRouter);
router.use("/konobari",konobarRouter);
router.use("/administratori",adminRouter);
router.use("/zahtevi",zahtevRouter);
router.use("/restorani",restoranRouter);
router.use("/rezervacije",rezervacijaRouter);
router.use("/jela",jeloRouter);
router.use("/dostave",dostavaRouter);

app.use("/",router);
app.listen(4000, () => console.log(`Express server running on port 4000`));