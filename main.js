const express = require('express')
const app = express()
const port = 3000

app.use(express.json());

const patientsRouter = require('./routes/patients');
app.use('/patients', patientsRouter);

const doctorsRouter = require('./routes/doctors');
app.use('/doctors', doctorsRouter);

const appointmentsRouter = require('./routes/appointments');
app.use('/appointments', appointmentsRouter);


app.listen(port, () => {
    console.log(`app listening on port ${port}`)
  })

// endpoints 
// patients doctors пациенты и доктора
// appointments - это все записи на прием
// appointments/book - записать пациента к врачу
