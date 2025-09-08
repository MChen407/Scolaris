import express from "express";
import {
    getAllClasses,
    getClasseById,
    createClasse,
    updateClasse,
    deleteClasse,
    getClassesByNiveau
} from "../controllers/classe.controller.js";

const router = express.Router();

router.get("/", getAllClasses);
router.get("/niveau/:niveau", getClassesByNiveau);
router.get("/:id", getClasseById);
router.post("/", createClasse);
router.put("/:id", updateClasse);
router.delete("/:id", deleteClasse);

export default router;