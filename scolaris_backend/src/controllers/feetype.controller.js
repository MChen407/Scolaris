import FeeType from "../models/feeType.model";

const getAllFeeTypes = async (req, res) => {
    const feeType = await FeeType.findAll();
    res.json(feeType);
}

const createFeeType = async (req, res) => {
    const {name, amount, dueDate} = req.body;
    const feeType = await FeeType.create({name, amount, dueDate});
    res.status(201).json(feeType);
}

const updateFeeType = async (req, res) => {
    const {id} = req.params;
    const {name, amount, dueDate} = req.body;
    const feeType = await FeeType.findByPk(id);
    if(!feeType) {
        return res.status(404).json({error: "Type de payement non trouvé"});
    }
    await feeType.update({name, amount, dueDate});
    res.json(feeType);
}

const deleteType = async (req, res) => {
    const {id} = req.params;
    const feeType = await FeeType.findByPk(id);
    if(!feeType) {
        return res.status(404).json({error: "Type de payement non trouvé"});
    }
    await feeType.destroy();
    res.json({message: "Type de payement supprimé avec succès"});
}

module.exports = {
    getAllFeeTypes,
    createFeeType,
    updateFeeType,
    deleteType
}