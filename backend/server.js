import express from 'express';
import { createPool } from 'mysql2/promise';
import cors from 'cors';
import favicon from 'serve-favicon';
import path from 'path';

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
const app = express();
app.use(express.json());
app.use(cors());

const db = createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'darsa',
    password: process.env.DB_PASSWORD || 'darsa',
    database: process.env.DB_NAME || 'alter_faculty'
});

app.get('/requests/:email', async (req, res) => {
    const  email  = req.params;
    console.log(`Fetching receiver ID for email: ${email}`);
    try {
        const connection = await db.getConnection();
        const [rows] = await connection.query(`
            SELECT f.id, f.name, f.unique_id, f.email_alter, f.date_alter, f.session, f.venue, f.status
            FROM form f
            WHERE f.email_alter = ?
        `, [email]);
        connection.release();
        res.status(200).json(rows);
    } catch (err) {
        console.error("Error in fetching email values:", err);
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

app.post('/login', async (req, res) => {
    let connection;
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        connection = await db.getConnection();
        const [results] = await connection.execute('SELECT * FROM login WHERE email = ? AND password = ?', [email, password]);
        connection.release();

        if (results.length > 0) {
            res.status(200).json({ message: 'Login successful' });
        } else {
            res.status(400).json({ message: 'Invalid email or password' });
        }
    } catch (err) {
        console.error('Error during login', err);
        res.status(500).json({ message: 'Internal server error', error: err.message });
    } finally {
        if (connection) connection.release();
    }
});

app.get('/form_add', async (req, res) => {
    try {
        const connection = await db.getConnection();
        const [rows] = await connection.query('SELECT * FROM form');
        connection.release();
        res.status(200).json(rows);
    } catch (err) {
        console.error('Error in fetching data', err);
        res.status(500).json({ message: 'Internal Server error', error: err.message });
    }
});

app.post('/form', async (req, res) => {
    try {
        const { name, unique_id, email_alter, date_alter, session, venue } = req.body;
        if (!name || !unique_id || !email_alter || !date_alter || !session || !venue) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const connection = await db.getConnection();
        const sql = 'INSERT INTO form (name, unique_id, email_alter, date_alter, session, venue, status) VALUES (?, ?, ?, ?, ?, ?, ?)';
        await connection.query(sql, [name, unique_id, email_alter, date_alter, session, venue, 'pending']);
        connection.release();
        res.status(200).json({ message: 'Data added successfully' });
    } catch (err) {
        console.error('Error in POST /form:', err);
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

app.post('/form/update', async (req, res) => {
    const { formId, status } = req.body;
    if (!formId || !status) {
        return res.status(400).json({ message: 'Form ID and status are required' });
    }

    try {
        const connection = await db.getConnection();
        const sql = 'UPDATE form SET status = ? WHERE id = ?';
        await connection.query(sql, [status, formId]);
        connection.release();
        res.status(200).json({ message: 'Form status updated successfully' });
    } catch (err) {
        console.error('Error updating form status:', err);
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
