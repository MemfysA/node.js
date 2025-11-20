const express = require('express');
const path = require('path');
const fs = require('fs');



const router = express.Router();

// Это функция которая загружает записи из JSON файла
// loadAppointments() — загружает записи из JSON 
// JSON.parse(data) — превращает JSON-строку в объект/массив
function loadAppointments() {
    try {
        const filePath = path.join(__dirname, '..', 'data', 'appointments.json');
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}


function saveAppointments(appointments) {
    const filePath = path.join(__dirname, '..', 'data', 'appointments.json');
    fs.writeFileSync(filePath, JSON.stringify(appointments, null, 2), 'utf8');
}

function loadDoctors() {
    try {
        const filePath = path.join(__dirname, '..', 'data', 'doctors.json');
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

function loadPatients() {
    try {
        const filePath = path.join(__dirname, '..', 'data', 'patients.json');
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

// функция удаления записи


router.get('/book', (req, res) => {
    res.status(201).json({ message: 'Запись на прием создана' });
});

router.get('/', (req, res) => {
    const appointments = loadAppointments();
    res.json(appointments);
});

router.post('/', (req, res) => {
    // const { patientId, doctorId, time } = req.body;
    // const doctors = loadDoctors();
    // const patients = loadPatients();
    // const doctor = doctors.find(d => d.id === doctorId);

    // if (!doctor) {
    //     return res.status(404).json({ error: 'Доктор не найден' });
    // }

    // if (!doctor.slots.includes(time)) {
    //     return res.status(400).json({ error: 'Нерабочее время' });
    // }

    // const appointments = loadAppointments();
    // const isTaken = appointments.some(app => app.doctorId === doctorId && app.time === time);
    // if (isTaken) {
    //     return res.status(400).json({ error: 'На это время есть запись' });
    // }

    // const patient = patients.find(p => p.id === patientId);
    // if (!patient) {
    //     return res.status(404).json({ error: 'Такого пациента нет' });
    // }

    // const newAppointment = { doctorId, patientId, time };
    // const updatedAppointments = [...appointments, newAppointment];
    // saveAppointments(updatedAppointments);

    // res.status(201).json(newAppointment);
});

router.post('/book', (req, res) => {
    const { patientId, doctorId, time } = req.body;
    const doctors = loadDoctors();
    const patients = loadPatients();
    const doctor = doctors.find(d => d.id === doctorId);

    if (!doctor) {
        return res.status(404).json({ error: 'Доктор не найден' });
    }

    if (!doctor.slots.includes(time)) {
        return res.status(400).json({ error: 'Нерабочее время' });
    }
    //в isTaken записывается значение вычисленное справа от знака равно
    //some проверяет есть ли в appointments фукнция вернет true
    const appointments = loadAppointments();
    const isTaken = appointments.some(app => app.doctorId === doctorId && app.time === time);
    if (isTaken) {
        return res.status(400).json({ error: 'На это время есть запись' });
    }

    const patient = patients.find(p => p.id === patientId);
    if (!patient) {
        return res.status(404).json({ error: 'Такого пациента нет' });
    }

    const updatedAppointments = [...appointments, { doctorId, patientId, time }];
    saveAppointments(updatedAppointments);

    res.json({ message: 'Пациент записан' });
});

router.put('/', (req, res) => {
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


router.delete('/:index', (req, res) => {
    const index = parseInt(req.params.index);
    const appointments = loadAppointments();

    if (index < 0 || index >= appointments.length) {
        return res.status(404).json({ error: 'Запись не найдена' });
    }

    const deletedAppointment = appointments.splice(index, 1)[0];
    saveAppointments(appointments);

    res.json({ message: 'Запись удалена', appointment: deletedAppointment });
});

module.exports = router;