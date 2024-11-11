// healthRecordRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
    try {
        const { patientId, diagnosis, prescription, notes, attachments } = req.body;
        const record = new HealthRecord({
            patient: patientId,
            doctor: req.user._id,
            diagnosis,
            prescription,
            notes,
            attachments
        });
        await record.save();
        res.status(201).json(record);
    } catch (error) {
        res.status(500).json({ message: 'Error creating health record', error: error.message });
    }
});

router.get('/patient/:patientId', auth, async (req, res) => {
    try {
        const records = await HealthRecord.find({ patient: req.params.patientId })
            .populate('doctor', 'name')
            .sort('-createdAt');
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching health records', error: error.message });
    }
});

router.get('/doctor/records', auth, async (req, res) => {
    try {
        const records = await HealthRecord.find({ doctor: req.user._id })
            .populate('patient', 'name')
            .sort('-createdAt');
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching health records', error: error.message });
    }
});

module.exports =  router;