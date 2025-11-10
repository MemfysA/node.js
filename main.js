const express = require('express')
const fs = require('fs');
const path = require('path');
const app = express()
const port = 3000

function loadPatients() {
    try {
        const filePath = path.join(__dirname, 'data', 'patients.json');
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

function loadDoctors() {
    try {
        const filePath = path.join(__dirname, 'data', 'doctors.json');
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

function loadAppointments() {
    try {
        const filePath = path.join(__dirname, 'data', 'appointments.json');
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

function saveAppointments(appointments) {
    const filePath = path.join(__dirname, 'data', 'appointments.json');
    fs.writeFileSync(filePath, JSON.stringify(appointments, null, 2), 'utf8');
}

function savePatients(patients) {
    const filePath = path.join(__dirname, 'data', 'patients.json');
    fs.writeFileSync(filePath, JSON.stringify(patients, null, 2), 'utf8');
}


const patients = loadPatients();
const doctors = loadDoctors();
const appointments = loadAppointments();

app.use(express.json());

app.get('/patients', (req, res) => {
    res.json(patients);
});


app.get('/patients/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const patient = patients.find(p => p.id === id);
    
    if (!patient) {
        return res.status(404).json({ message: 'Пациент не найден' });
    }
    
    res.json(patient);
});

app.post('/patients', (req, res) => {
    const { phone, name } = req.body;
    
    if (!phone || !name) {
        return res.status(400).json({ message: 'Телефон и имя обязательны' });
    }
    
    const newId = patients.length > 0 ? Math.max(...patients.map(p => p.id)) + 1 : 1;
    const newPatient = { id: newId, phone, name };
    patients.push(newPatient);
    savePatients(patients);
    
    res.status(201).json(newPatient);
});

app.put('/patients/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { phone, name } = req.body;
    
    const patientIndex = patients.findIndex(p => p.id === id);
    
    if (patientIndex === -1) {
        return res.status(404).json({ message: 'Пациент не найден' });
    }
    
    if (phone) patients[patientIndex].phone = phone;
    if (name) patients[patientIndex].name = name;
    savePatients(patients);
    
    res.json(patients[patientIndex]);
});

app.delete('/patients/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const patientIndex = patients.findIndex(p => p.id === id);
    
    if (patientIndex === -1) {
        return res.status(404).json({ message: 'Пациент не найден' });
    }
    
    const deletedPatient = patients.splice(patientIndex, 1)[0];
    savePatients(patients);
    res.json({ message: 'Пациент удален', patient: deletedPatient });
});

app.get('/book', (req, res) => {
    res.send(res.status(201).json({message: 'Запись на прием создана'}));
});

app.get('/appointments', (req, res) => {
    appointments = loadAppointments(); 
    res.json(appointments);
});

app.post('/book', (req, res) => {
    const { patientId, doctorId, time } = req.body;
    const doctor = doctors.find(d => d.id === doctorId);
    
    if (!doctor) {
        return res.status(404).json({ error: 'Доктор не найден' });
    }
    
    if (!doctor.slots.includes(time)) {
        return res.status(400).json({ error: 'Нерабочее время' });
    }
    //в isTaken записывается значение вычисленное справа от знака равно
    //some проверяет есть ли в appointments фукнция вернет true
    const isTaken = appointments.some(app => app.doctorId === doctorId && app.time === time);
    if (isTaken) {
        return res.status(400).json({ error: 'На это время есть запись' });
    }
    
    const patient = patients.find(p => p.id === patientId);
    if (!patient) {
        return res.status(404).json({ error: 'Такого пациента нет' });
    }

    appointments.push({ doctorId, patientId, time });
    saveAppointments(appointments);

    res.json({ message: 'Пациент записан' });
});




app.route('/doctors')
    .get((req, res) => {
        res.json(doctors)
    })
    .post((req, res) => {
        res.send('POST')
    })
    .put((req, res) => {
        res.send('PUT')
    })
    .delete((req, res) => {
        res.send('DELETE')
    })


app.listen(port, () => {
    console.log(`app listening on port ${port}`)
  })


