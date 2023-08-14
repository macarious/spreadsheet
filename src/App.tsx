/**
 * @jest-environment jsdom
 */

import React, { useEffect, useState } from 'react';
import './App.css';
import SpreadSheet from './Components/SpreadSheet';
import SpreadSheetClient from './Engine/SpreadSheetClient';

export default function App() {
  const [documentName, setDocumentName] = useState("");
  const [activeDocument, setActiveDocument] = useState(""); // Tracks the active document name
  const [documentNames, setDocumentNames] = useState<string[]>([]);

  useEffect(() => {
    async function fetchDocumentNames() {
      try {
        const response = await SpreadSheetClient.getCreatedDocuments();
        setDocumentNames(response); // Update the document names state with the received data
      } catch (error) {
        console.error("Error fetching document names:", error);
      }
    }

    fetchDocumentNames();
  }, [activeDocument]); // Fetch document names only once, when the component is mounted

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (documentName) {
      try {
        await SpreadSheetClient.createDocument(documentName);
        setDocumentName(""); // Clear the input field after successful creation
        setActiveDocument(documentName); // Set the active document
      } catch (error) {
        console.error("Error creating document:", error);
      }
    }
  };

  const handleLoadDocument = (name: string) => {
    setActiveDocument(name);
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
                <span>{docName}</span>
                <button onClick={() => handleLoadDocument(docName)}>Load</button>
                <button onClick={() => handleDeleteDocument(docName)}>Delete</button>
              </div>
            ))}
          </div>
        )}
        {activeDocument && <SpreadSheet documentName={activeDocument} />}
      </header>
    </div>
  );
}
