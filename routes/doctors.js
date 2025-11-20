const express = require('express');
const path = require('path');
const fs = require('fs');



const router = express.Router();

//загрузка из файла
function loadDoctors() {
    try {
        const filePath = path.join(__dirname, '..', 'data', 'doctors.json');
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

//сохранение в файл
function saveDoctors(doctors) {
    const filePath = path.join(__dirname, '..', 'data', 'doctors.json');
    fs.writeFileSync(filePath, JSON.stringify(doctors, null, 2), 'utf8');
}

function loadAppointments() {
    try {
        const filePath = path.join(__dirname, '..', 'data', 'appointments.json');
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}


//получить обьяснения 
router.get('/', (req, res) => {
    const doctors = loadDoctors();
    const appointments = loadAppointments();

    const enriched = doctors
        .map(doc => ({
            ...doc,
            appointmentCount: appointments.filter(a => a.doctorId === doc.id).length
        }))
        .sort((a, b) => b.appointmentCount - a.appointmentCount);



    res.json(enriched);
});


router.get('/:id', (req, res) => {
    const doctors = loadDoctors();
    const id = parseInt(req.params.id);
    const doctor = doctors.find(d => d.id === id);

    if (!doctor) {
        return res.status(404).json({ message: 'Доктор не найден' });
    }

    res.json(doctor);
});


router.post('/', (req, res) => {
    const { name, specialization, slots } = req.body;

    if (!name || !specialization) {
        return res.status(400).json({ message: 'Имя и специализация обязательны' });
    }

    const doctors = loadDoctors();
    const newId = doctors.length > 0 ? Math.max(...doctors.map(d => d.id)) + 1 : 1;

    const newDoctor = {
        id: newId,
        name,
        specialization,
        // если слоты не передали — пусть будет пустой массив
        slots: Array.isArray(slots) ? slots : []
    };

    doctors.push(newDoctor);
    saveDoctors(doctors);

    res.status(201).json(newDoctor);
});


router.put('/:id', (req, res) => {
    const { name, specialization, slots } = req.body;
    const id = parseInt(req.params.id);

    const doctors = loadDoctors();
    const doctorIndex = doctors.findIndex(d => d.id === id);

    if (doctorIndex === -1) {
        return res.status(404).json({ message: 'Доктор не найден' });
    }

    if (name) doctors[doctorIndex].name = name;
    if (specialization) doctors[doctorIndex].specialization = specialization;
    if (Array.isArray(slots)) doctors[doctorIndex].slots = slots;

    saveDoctors(doctors);
    res.json(doctors[doctorIndex]);
});


router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const doctors = loadDoctors();
    const doctorIndex = doctors.findIndex(d => d.id === id);

    if (doctorIndex === -1) {
        return res.status(404).json({ message: 'Доктор не найден' });
    }

    const deletedDoctor = doctors.splice(doctorIndex, 1)[0];
    saveDoctors(doctors);

    res.json({ message: 'Доктор удален', doctor: deletedDoctor });
});

module.exports = router;