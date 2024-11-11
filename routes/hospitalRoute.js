const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.post('/', async (req, res) => {
    try {
        const { name, address, contact, facilities, departments } = req.body;
        const hospital = new Hospital({
            name,
            address,
            contact,
            facilities,
            departments
        });
        await hospital.save();
        res.status(201).json(hospital);
    } catch (error) {
        res.status(500).json({ message: 'Error creating hospital', error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const hospitals = await Hospital.find({});
        res.json(hospitals);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching hospitals', error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const hospital = await Hospital.findById(req.params.id);
        if (!hospital) {
            return res.status(404).json({ message: 'Hospital not found' });
        }
        res.json(hospital);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching hospital', error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { name, address, contact, facilities, departments } = req.body;
        const hospital = await Hospital.findByIdAndUpdate(
            req.params.id,
            { name, address, contact, facilities, departments },
            { new: true }
        );
        if (!hospital) {
            return res.status(404).json({ message: 'Hospital not found' });
        }
        res.json(hospital);
    } catch (error) {
        res.status(500).json({ message: 'Error updating hospital', error: error.message });
    }
});

module.exports = router;