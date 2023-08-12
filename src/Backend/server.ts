import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import database from './database';

const app = express();
const PORT = 3005;
app.use(bodyParser.json());
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
app.use(cors());


app.get('/sheetState', (req, res) => {
    res.json(database.sheetState);
});

app.post('/lockCell', (req, res) => {
    const { cellLabel, userName } = req.body;
    //make sure empty string is not a valid username
    if (!cellLabel || !userName) {
        return res.status(400).send({ error: "Invalid cell or username." });
    }
    const editingBy = database.lockCell(cellLabel, userName);
    if (editingBy) {
        return res.status(400).send({ editingBy });
    }
    res.send({ status: 'locked' });
});

app.post('/unlockCell', (req, res) => {
    const { cellLabel, userName } = req.body;
    if (!database.unlockCell(cellLabel, userName)) {
        return res.status(403).send({ error: "You don't have the lock on this cell." });
    }
    res.send({ status: 'unlocked' });
});

app.post('/updateCell', (req, res) => {
    const { cellLabel, formula, userName } = req.body;
    if (!cellLabel || !Array.isArray(formula)) {
        return res.status(400).send({ error: "Invalid cell or formula format." });
    }
    if (!database.updateCell(cellLabel, formula)) {
        return res.status(403).send({ error: "You don't have the lock on this cell." });
    }
    res.json({ status: 'updated', updatedCell: { [cellLabel]: formula }, version: database.state.version });
});

app.get('/getVersion', (req, res) => {
    res.json({ version: database.state.version });
});

app.get('/cellStatus/:cellLabel', (req, res) => {
    const { cellLabel } = req.params;
    res.send({ editingBy: database.getEditingStatus(cellLabel) });
});

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});