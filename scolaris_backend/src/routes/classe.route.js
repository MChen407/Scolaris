import express from "express";
import {
    getAllClasses,
    getClasseById,
    createClasse,
    updateClasse,
    deleteClasse
} from "../controllers/classe.controller.js";

const router = express.Router();

router.get("/", getAllClasses);
router.get("/:id", getClasseById);
router.post("/", createClasse);
router.put("/:id", updateClasse);
router.delete("/:id", deleteClasse);

export default router;