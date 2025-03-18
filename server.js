const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/hospital', { useNewUrlParser: true, useUnifiedTopology: true });

const patientSchema = new mongoose.Schema({
    date: Date,
    name: String,
    age: Number,
    address: String,
    co: String,
    lab: String,
});

const Patient = mongoose.model('Patient', patientSchema);

// Middleware to check JWT token
const authenticate = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    try {
        const decoded = jwt.verify(token, 'secret_key');
        req.user = decoded;
        next();
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' });
    }
};

// Create a new patient record
app.post('/patients', authenticate, async (req, res) => {
    const patient = new Patient(req.body);
    try {
        await patient.save();
        res.status(201).send(patient);
    } catch (e) {
        res.status(400).send(e);
    }
});

// Retrieve patient records
app.get('/patients', authenticate, async (req, res) => {
    try {
        const patients = await Patient.find({});
        res.send(patients);
    } catch (e) {
        res.status(500).send(e);
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});