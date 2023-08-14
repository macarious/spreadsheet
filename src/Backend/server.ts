import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import Spreadsheet from "./Spreadsheet";

const app = express();
const PORT = 3005;
app.use(bodyParser.json());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
app.use(cors());

const spreadsheets: { [key: string]: Spreadsheet } = {}; // Dictionary to store spreadsheet instances

app.post("/createSpreadsheet/:documentName", (req, res) => {
  const { documentName } = req.params;
  if (!spreadsheets[documentName]) {
    spreadsheets[documentName] = new Spreadsheet();
  }
  return res.json({ message: "Document created or loaded" });
});

app.post("/deleteSpreadsheet/:documentName", (req, res) => {
    const { documentName } = req.params;
    if (spreadsheets[documentName]) {
        delete spreadsheets[documentName];
    }
    return res.json({ message: "Document deleted" });
    });

app.get("/documents/:documentName/sheetState", (req, res) => {
  const { documentName } = req.params;
  const spreadsheet = spreadsheets[documentName];
  if (!spreadsheet) {
    return res.status(404).json({ error: "Document not found" });
  }
  res.json(spreadsheet.sheetState);
});

app.get("/documents/:documentName/sheetState", (req, res) => {
  const { documentName } = req.params;
  const spreadsheet = spreadsheets[documentName];
  if (!spreadsheet) {
    return res.status(404).json({ error: "Document not found" });
  }
  res.json(spreadsheet.sheetState);
});

app.post("/documents/:documentName/lockCell", (req, res) => {
  const { documentName } = req.params;
  const spreadsheet = spreadsheets[documentName];
  if (!spreadsheet) {
    return res.status(404).json({ error: "Document not found" });
  }

  const { cellLabel, userName } = req.body;
  //make sure empty string is not a valid username
  if (!cellLabel || !userName) {
    return res.status(400).send({ error: "Invalid cell or username." });
  }
  const editingBy = spreadsheet.lockCell(cellLabel, userName);
  if (editingBy) {
    return res.status(400).send({ editingBy });
  }
  res.send({ status: "locked" });
});

app.post("/documents/:documentName/unlockCell", (req, res) => {
  const { documentName } = req.params;
  const spreadsheet = spreadsheets[documentName];
  if (!spreadsheet) {
    return res.status(404).json({ error: "Document not found" });
  }

  const { cellLabel, userName } = req.body;
  if (!spreadsheet.unlockCell(cellLabel, userName)) {
    return res
      .status(403)
      .send({ error: "You don't have the lock on this cell." });
  }
  res.send({ status: "unlocked" });
});

app.post("/documents/:documentName/updateCell", (req, res) => {
  const { documentName } = req.params;
  const spreadsheet = spreadsheets[documentName];
  if (!spreadsheet) {
    return res.status(404).json({ error: "Document not found" });
  }

  const { cellLabel, formula, userName } = req.body;
  if (!cellLabel || !Array.isArray(formula)) {
    return res.status(400).send({ error: "Invalid cell or formula format." });
  }
  if (!spreadsheet.updateCell(cellLabel, formula)) {
    return res
      .status(403)
      .send({ error: "You don't have the lock on this cell." });
  }
  res.json({
    status: "updated",
    updatedCell: { [cellLabel]: formula },
    version: spreadsheet.state.version,
  });
});

app.get("/documents/:documentName/getVersion", (req, res) => {
  const { documentName } = req.params;
  const spreadsheet = spreadsheets[documentName];
  if (!spreadsheet) {
    return res.status(404).json({ error: "Document not found" });
  }

  res.json({ version: spreadsheet.state.version });
});

// Define a route to get the names of all currently created documents
app.get("/createdDocuments", (req, res) => {
    const documentNames = Object.keys(spreadsheets);
    res.json(documentNames);
  });

app.get("/documents/:documentName/cellStatus/:cellLabel", (req, res) => {
  const { documentName, cellLabel } = req.params;
  const spreadsheet = spreadsheets[documentName];
  if (!spreadsheet) {
    return res.status(404).json({ error: "Document not found" });
  }

  const editingBy = spreadsheet.getEditingStatus(cellLabel);
  res.json({ editingBy });
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
