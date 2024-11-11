const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
    try {
        const { doctorId, date, time, type, description } = req.body;
        const appointment = new Appointment({
            patient: req.user._id,
            doctor: doctorId,
            date,
            time,
            type,
            description,
            status: 'pending'
        });
        await appointment.save();
        res.status(201).json(appointment);
    } catch (error) {
        res.status(500).json({ message: 'Error creating appointment', error: error.message });
    }
});

router.get('/my-appointments', auth, async (req, res) => {
    try {
        const appointments = await Appointment.find({
            $or: [
                { patient: req.user._id },
                { doctor: req.user._id }
            ]
        }).populate('patient doctor', 'name email');
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching appointments', error: error.message });
    }
});

router.patch('/:id/status', auth, async (req, res) => {
    try {
        const { status } = req.body;
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate('patient doctor', 'name email');
        res.json(appointment);
    } catch (error) {
        res.status(500).json({ message: 'Error updating appointment', error: error.message });
    }
});

module.exports = router;