import React, { useEffect, useState } from 'react';
import './App.css';
import SpreadSheet from './Components/SpreadSheet';
import SpreadSheetClient from './Engine/SpreadSheetClient';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

export default function App() {
  const [documentName, setDocumentName] = useState("");
  const [documentNames, setDocumentNames] = useState<string[]>([]);

  useEffect(() => {
    async function fetchDocumentNames() {
      try {
        const response = await SpreadSheetClient.getCreatedDocuments();
        setDocumentNames(response);
      } catch (error) {
        console.error("Error fetching document names:", error);
      }
    }

    fetchDocumentNames();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (documentName) {
      try {
        await SpreadSheetClient.createDocument(documentName);
        setDocumentName("");
        setDocumentNames((prevNames) => [...prevNames, documentName]); // Update document names with the new name
      } catch (error) {
        console.error("Error creating document:", error);
      }
    }
  };
  const handleDeleteDocument = async (name: string) => {
    try {
      await SpreadSheetClient.deleteDocument(name);
      setDocumentNames((prevNames) => prevNames.filter((n) => n !== name));
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <input
            type="text"
            id="username"
            placeholder="username"
          />
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Enter Document Name"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
            />
            <button type="submit">Create Document</button>
          </form>
          {documentNames.length > 0 && (
            <div>
              {documentNames.map((docName) => (
                <div key={docName} className="document-entry">
                  <Link to={`/${docName}`}>{docName}</Link>
                  <button onClick={() => handleDeleteDocument(docName)}>Delete</button>
                </div>
              ))}
            </div>
          )}
          <Routes>
            {documentNames.map((docName) => (
              <Route
                key={docName}
                path={`/${docName}`}
                element={<SpreadSheet documentName={docName} />}
              />
            ))}
          </Routes>
        </header>
      </div>
    </Router>
  );
}
