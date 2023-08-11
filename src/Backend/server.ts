import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = 3005;
app.use(bodyParser.json());
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
app.use(cors());


let state = {
    version: 0,
  };
  
  
const cellEditingStatus: { [key: string]: string } = {};
const sheetState: { [key: string]: string[] } = {
    "A1": ["5"],
    "B1": ["A1", "+", "5"],
    "A2": ["3"],
}


app.get('/sheetState', (req, res) => {
    res.json(sheetState);
});

app.post('/lockCell', (req, res) => {
    const { cellLabel, userName } = req.body;
    if (cellEditingStatus[cellLabel] && cellEditingStatus[cellLabel] !== userName) {
        // Cell is already being edited by someone
        return res.status(400).send({ editingBy: cellEditingStatus[cellLabel] });
    }
    cellEditingStatus[cellLabel] = userName;
    res.send({ status: 'locked' });
});
app.post('/unlockCell', (req, res) => {
    const { cellLabel, userName } = req.body;
    if (cellEditingStatus[cellLabel] !== userName) {
        return res.status(403).send({ error: "You don't have the lock on this cell." });
    }
    delete cellEditingStatus[cellLabel];
    res.send({ status: 'unlocked' });
});

app.post('/updateCell', (req, res) => {
    const { cellLabel, formula, userName } = req.body;
    
    if (!cellLabel || !Array.isArray(formula)) {
        return res.status(400).send({ error: "Invalid cell or formula format." });
    }
    
    // Check if the user holds the lock on the cell
    if (cellEditingStatus[cellLabel] !== userName) {
        return res.status(403).send({ error: "You don't have the lock on this cell." });
    }
    sheetState[cellLabel] = formula;
    state.version += 1;
    res.json({ status: 'updated', updatedCell: { [cellLabel]: formula }, version: state.version });
});

app.get('/getVersion', (req, res) => {
    res.json({ version: state.version });
});

app.get('/cellStatus/:cellLabel', (req, res) => {
    const { cellLabel } = req.params;
    res.send({ editingBy: cellEditingStatus[cellLabel] || null });
});

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});