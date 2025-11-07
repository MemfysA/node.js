const express = require('express')
const app = express()
const port = 3000

app.use(express.json());

const patients = [
    { id: 1, phone: '1234567890', name: 'John' },
    { id: 2, phone: '1234567890', name: 'Jane' },
    { id: 3, phone: '1234567890', name: 'Jim' },
    { id: 4, phone: '1234567890', name: 'Jill' },
    { id: 5, phone: '1234567890', name: 'Jack' },
    { id: 6, phone: '1234567890', name: 'Alex' },
    { id: 7, phone: '1234567890', name: 'Bob' },
    { id: 8, phone: '1234567890', name: 'Charlie' },
    { id: 9, phone: '1234567890', name: 'David' },
    { id: 10, phone: '1234567890', name: 'Eve' },
]

const doctors = [
    { id: 1, name: 'Dr. Kaleb', slots: ['2025-11-01T10:00:00', '2025-11-02T11:00:00'],},
    { id: 2, name: 'Dr. Patrick', slots: ['2025-11-01T10:00:00', '2025-11-02T11:00:00'], },
    { id: 3, name: 'Dr. Adam', slots: ['date_time', 'date_time'], },
]

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
    
    res.json(patients[patientIndex]);
});

app.delete('/patients/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const patientIndex = patients.findIndex(p => p.id === id);
    
    if (patientIndex === -1) {
        return res.status(404).json({ message: 'Пациент не найден' });
    }
    
    const deletedPatient = patients.splice(patientIndex, 1)[0];
    res.json({ message: 'Пациент удален', patient: deletedPatient });
});

app.get('/book', (req, res) => {
    res.send(res.status(201).json({message: 'Запись на прием создана'}));
});

//Массив хранить записи на прием
let appointments = [];

app.get('/appointments', (req, res) => {
    res.json(appointments);
});


app.post('/book', (req, res) => {
    // Извлекаем ID пациента ID врача и время приема (деструктуризация)
    const { patientId, doctorId, time } = req.body;

    // Если нет врача - статус код 404 (find ищет врача по id) 
    const doctor = doctors.find(d => d.id === doctorId);
    
    if (!doctor) {
        return res.status(404).json({ error: 'Доктор не найден' });
    }
    // Если в doctor.slots нет времени time, то статус код 400
    if (!doctor.slots.includes(time)) {
        return res.status(400).json({ error: 'Нерабочее время' });
    }
    //в isTaken записывается значение вычисленное справа от знака равно
    //some проверяет есть ли в appointments фукнция вернет true
    const isTaken = appointments.some(app => app.doctorId === doctorId && app.time === time);
    if (isTaken) {
        return res.status(400).json({ error: 'На это время есть запись' });
    }
    //Так же по id ищем пациента
    const patient = patients.find(p => p.id === patientId);
    if (!patient) {
        return res.status(404).json({ error: 'Такого пациента нет' });
    }

    appointments.push({ doctorId, patientId, time });

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


