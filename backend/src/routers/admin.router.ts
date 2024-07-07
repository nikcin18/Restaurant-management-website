import express from 'express'
import { AdminController } from '../controllers/admin.controller';

const adminRouter=express.Router();

adminRouter.route("/login").post(
    (req,res)=>new AdminController().login(req,res)
)

adminRouter.route("/zahtevKonobar").post(
    (req,res)=>new AdminController().zahtevKonobar(req,res)
)

adminRouter.route("/promeniLozinku").post(
    (req,res)=>new AdminController().promeniLozinku(req,res)
)

adminRouter.route("/dohvatiBezbPitanje").post(
    (req,res)=>new AdminController().dohvatiBezbPitanje(req,res)
)

adminRouter.route("/proveriBezbOdgovor").post(
    (req,res)=>new AdminController().proveriBezbOdgovor(req,res)
)

adminRouter.route("/promeniLozinkuProvereno").post(
    (req,res)=>new AdminController().promeniLozinkuProvereno(req,res)
)

export default adminRouter;