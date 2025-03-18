import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
    const [patients, setPatients] = useState([]);
    const [patient, setPatient] = useState({
        date: '',
        name: '',
        age: '',
        address: '',
        co: '',
        lab: '',
    });

    useEffect(() => {
        // Fetch patient records
        const fetchPatients = async () => {
            const res = await axios.get('/patients', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setPatients(res.data);
        };

        fetchPatients();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPatient({ ...patient, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await axios.post('/patients', patient, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setPatients([...patients, res.data]);
        setPatient({ date: '', name: '', age: '', address: '', co: '', lab: '' });
    };

    return (
        <div>
            <h1>Patient Records</h1>
            <form onSubmit={handleSubmit}>
                <input type="date" name="date" value={patient.date} onChange={handleChange} required />
                <input type="text" name="name" value={patient.name} onChange={handleChange} placeholder="Name" required />
                <input type="number" name="age" value={patient.age} onChange={handleChange} placeholder="Age" required />
                <input type="text" name="address" value={patient.address} onChange={handleChange} placeholder="Address" required />
                <input type="text" name="co" value={patient.co} onChange={handleChange} placeholder="C/O" required />
                <input type="text" name="lab" value={patient.lab} onChange={handleChange} placeholder="Lab" required />
                <button type="submit">Add Patient</button>
            </form>
            <ul>
                {patients.map((patient) => (
                    <li key={patient._id}>{patient.name} - {patient.age} years</li>
                ))}
            </ul>
        </div>
    );
};

export default App;