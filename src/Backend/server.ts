import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());
const PORT = 3005;
app.use(cors());

const cellEditingStatus: { [key: string]: string } = {};
const sheetState = {
    "A1": ["5"],
    "B1": ["A1", "+", "5"],
    "A2": ["3"],
}


app.get('/sheetState', (req, res) => {
    res.json(sheetState);
});

app.post('/lockCell', (req, res) => {
    const { cellLabel, userName } = req.body;
    if (cellEditingStatus[cellLabel]) {
        // Cell is already being edited by someone
        return res.status(400).send({ editingBy: cellEditingStatus[cellLabel] });
    }
    cellEditingStatus[cellLabel] = userName;
    res.send({ status: 'locked' });
});

app.post('/releaseCell', (req, res) => {
    const { cellLabel } = req.body;
    delete cellEditingStatus[cellLabel];
    res.send({ status: 'released' });
});

app.get('/cellStatus/:cellLabel', (req, res) => {
    const { cellLabel } = req.params;
    res.send({ editingBy: cellEditingStatus[cellLabel] || null });
});

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});