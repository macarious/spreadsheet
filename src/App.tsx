/**
 * @jest-environment jsdom
 */

import React from 'react';
import './App.css';
import SpreadSheet from './Components/SpreadSheet';
import SpreadSheetClient from './Engine/SpreadSheetClient';
import Home from './Components/Home';
import { useState } from 'react';

export default function App() {
  const [documentName, setDocumentName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (documentName) {
      try {
        await SpreadSheetClient.createDocument(documentName);
        setSubmitted(true);
      } catch (error) {
        console.error("Error creating document:", error);
      }
    }
  };

  console.log("documentName:", documentName); // Debugging: Check documentName value
  console.log("submitted:", submitted);       // Debugging: Check submitted value

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
        {submitted && <SpreadSheet documentName={documentName} />}
      </header>
    </div>
  );
}
