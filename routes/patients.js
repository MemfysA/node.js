const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();


//TODO: сделать асинхронные функции
function loadPatients() {
    try {
        const filePath = path.join(__dirname, '..', 'data', 'patients.json');
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

function savePatients(patients) {
    const filePath = path.join(__dirname, '..', 'data', 'patients.json');
    fs.writeFileSync(filePath, JSON.stringify(patients, null, 2), 'utf8');
}


router.get('/', (req, res) => {
    const patients = loadPatients();
    res.json(patients);
});


router.get('/:id', (req, res) => {
    const patients = loadPatients();
    const id = parseInt(req.params.id);
    const patient = patients.find(p => p.id === id);

    if (!patient) {
        return res.status(404).json({ message: 'Пациент не найден' });
    }

    res.json(patient);
});


router.post('/', (req, res) => {
    const { phone, name } = req.body;

    if (!phone || !name) {
        return res.status(400).json({ message: 'Телефон и имя обязательны' });
    }

    const patients = loadPatients();
    const newId = patients.length > 0 ? Math.max(...patients.map(p => p.id)) + 1 : 1;
    const newPatient = { id: newId, phone, name };

    patients.push(newPatient);
    savePatients(patients);

    res.status(201).json(newPatient);
});


router.put('/:id', (req, res) => {
    const { phone, name } = req.body;
    const id = parseInt(req.params.id);

    const patients = loadPatients();
    const patientIndex = patients.findIndex(p => p.id === id);

    if (patientIndex === -1) {
        return res.status(404).json({ message: 'Пациент не найден' });
    }

    if (phone) patients[patientIndex].phone = phone;
    if (name) patients[patientIndex].name = name;

    savePatients(patients);
    res.json(patients[patientIndex]);
});


router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const patients = loadPatients();
    const patientIndex = patients.findIndex(p => p.id === id);

    if (patientIndex === -1) {
        return res.status(404).json({ message: 'Пациент не найден' });
    }

    const deletedPatient = patients.splice(patientIndex, 1)[0];
    savePatients(patients);

    res.json({ message: 'Пациент удален', patient: deletedPatient });
});

module.exports = router;

