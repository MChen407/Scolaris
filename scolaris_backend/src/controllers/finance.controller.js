import { Payment, FeeType, Student, TeacherPayment, Teacher } from "../models/index.model.js";

export const getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.findAll({
            include: [
                { model: Student, attributes: ['firstName', 'lastName'] },
                { model: FeeType, attributes: ['name'] }
            ]
        });
        res.json(payments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createPayment = async (req, res) => {
    try {
        const { studentId, feeTypeId, amount, method, status } = req.body;
        
        const payment = await Payment.create({
            studentId,
            feeTypeId,
            amount,
            date: new Date().toISOString().split('T')[0],
            method,
            reference: `PAY-${Date.now()}`,
            status
        });
        
        res.status(201).json(payment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updatePayment = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, method, status } = req.body;
        
        const payment = await Payment.findByPk(id);
        if (!payment) return res.status(404).json({ error: "Paiement non trouvé" });
        
        await payment.update({ amount, method, status });
        
        const updatedPayment = await Payment.findByPk(id, {
            include: [
                { model: Student, attributes: ['firstName', 'lastName'] },
                { model: FeeType, attributes: ['name'] }
            ]
        });
        
        res.json(updatedPayment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getPaymentById = async (req, res) => {
    try {
        const { id } = req.params;
        const payment = await Payment.findByPk(id, {
            include: [
                { model: Student, attributes: ['firstName', 'lastName'] },
                { model: FeeType, attributes: ['name'] }
            ]
        });
        if (!payment) return res.status(404).json({ error: "Paiement non trouvé" });
        res.json(payment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deletePayment = async (req, res) => {
    try {
        const { id } = req.params;
        const payment = await Payment.findByPk(id);
        if (!payment) return res.status(404).json({ error: "Paiement non trouvé" });
        await payment.destroy();
        res.json({ message: "Paiement supprimé" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getPaymentHistory = async (req, res) => {
    try {
        const { studentId } = req.params;
        const payments = await Payment.findAll({
            where: { studentId },
            include: [
                { model: Student, attributes: ['firstName', 'lastName'] },
                { model: FeeType, attributes: ['name'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(payments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getFinanceStats = async (req, res) => {
    try {
        const payments = await Payment.findAll();
        
        const totalRevenue = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
        const pendingAmount = payments
            .filter(p => p.status === 'pending')
            .reduce((sum, p) => sum + parseFloat(p.amount), 0);
        const overdueAmount = payments
            .filter(p => p.status === 'overdue')
            .reduce((sum, p) => sum + parseFloat(p.amount), 0);
        
        const stats = {
            totalRevenue,
            totalPayments: payments.length,
            pendingAmount,
            overdueAmount,
            collectionRate: totalRevenue > 0 ? ((totalRevenue - pendingAmount - overdueAmount) / totalRevenue) * 100 : 0
        };
        
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const createTeacherPayment = async (req, res) => {
    try {
        const { teacherId, hours, rate, period } = req.body;
        
        if (!teacherId || !hours || !rate) {
            return res.status(400).json({ error: "Données manquantes" });
        }
        
        const total = parseFloat(hours) * parseFloat(rate);
        
        const payment = await TeacherPayment.create({
            teacherId: parseInt(teacherId),
            hours: parseFloat(hours),
            rate: parseFloat(rate),
            total,
            period: period || 'day',
            date: new Date().toISOString().split('T')[0],
            reference: `TEACH-${Date.now()}`
        });
        
        const paymentWithTeacher = await TeacherPayment.findByPk(payment.id, {
            include: [{ model: Teacher, attributes: ['firstName', 'lastName'] }]
        });
        
        res.status(201).json(paymentWithTeacher);
    } catch (error) {
        console.error('Erreur création paiement enseignant:', error);
        res.status(500).json({ error: error.message });
    }
};

export const getTeacherPayments = async (req, res) => {
    try {
        const payments = await TeacherPayment.findAll({
            include: [{ model: Teacher, attributes: ['firstName', 'lastName'] }],
            order: [['createdAt', 'DESC']]
        });
        res.json(payments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getFeeTypes = async (req, res) => {
    try {
        const feeTypes = await FeeType.findAll();
        res.json(feeTypes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getTeacherPaymentHistory = async (req, res) => {
    try {
        const { teacherId } = req.params;
        const payments = await TeacherPayment.findAll({
            where: { teacherId },
            include: [{ model: Teacher, attributes: ['firstName', 'lastName'] }],
            order: [['createdAt', 'DESC']]
        });
        res.json(payments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getTeacherStats = async (req, res) => {
    try {
        const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
        
        const allPayments = await TeacherPayment.findAll({
            include: [{ model: Teacher, attributes: ['firstName', 'lastName'] }]
        });
        
        const monthlyPayments = allPayments.filter(p => 
            p.date && p.date.startsWith(currentMonth)
        );
        
        const paidTeachers = new Set(monthlyPayments.map(p => p.teacherId));
        const totalTeachers = await Teacher.count();
        
        const stats = {
            totalTeachers,
            paidTeachersCount: paidTeachers.size,
            unpaidTeachersCount: totalTeachers - paidTeachers.size,
            totalPayments: allPayments.length,
            monthlyPayments: monthlyPayments.length,
            totalAmount: allPayments.reduce((sum, p) => sum + parseFloat(p.total || 0), 0),
            monthlyAmount: monthlyPayments.reduce((sum, p) => sum + parseFloat(p.total || 0), 0)
        };
        
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};