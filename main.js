const express = require('express')
const app = express()
const port = 3000

app.use(express.json());

const patients = [
    { id: 1, phone: '1234567890', name: 'John' },
    { id: 2, phone: '1234567890', name: 'Jane' },
    { id: 3, phone: '1234567890', name: 'Jim' },
]

const doctors = [
    { id: 1, name: 'Dr. Kaleb', slots: ['date_time', 'date_time'],},
    { id: 2, name: 'Dr. Patrick', slots: ['date_time', 'date_time'], },
    { id: 3, name: 'Dr. Adam', slots: ['date_time', 'date_time'], },
]

// app.get('/patients', (req, res) => {
//     res.json(patients);
// });

// app.get('/doctors', (req, res) => {
//     res.json(doctors);
// });

// app.get('/doctors/:id', (req, res) => {
//     res.send(req.params)
// });

// app.post('/patients', (req, res) => {
//     res.json('POST')
//     console.log(req.body)
// });

// app.put('/patients/', (req, res) => {
//     res.send('PUT')
// });

// app.delete('/patients/', (req, res) => {
//     res.send('DELETE')
// });


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


