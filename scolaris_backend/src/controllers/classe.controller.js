import  Classe from "../models/index.model";

const getAllClasses = async (req, res) => {
    const classes = await Classe.findAll();
    res.json(classes);
}
