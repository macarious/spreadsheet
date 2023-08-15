import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Button, Card, CloseButton, Form, ListGroup } from "react-bootstrap";

import SpreadSheet from "./Components/SpreadSheet";
import SpreadSheetClient from "./Engine/SpreadSheetClient";
import "./styles/App.css";

export default function App() {
  const [documentName, setDocumentName] = useState("");
  const [documentNames, setDocumentNames] = useState<string[]>([]);
  const [username, setUsername] = useState<string>(
    () => localStorage.getItem("username") || ""
  );

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
        window.location.href = `/${documentName}`; // Manually navigate to the new document's route
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

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = e.target.value;
    setUsername(newUsername);
    localStorage.setItem("username", newUsername); // Store the updated username in local storage
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Card
            className="menu-card d-flex flex-column align-items-center"
            style={{ minWidth: "300px" }}
          >
            {window.location.pathname == "/" ? (
              <p className="section-title">
                Welcome to <b className="app-name">Learn and Excel</b>
              </p>
            ) : (
              <p className="section-title">Document Manager</p>
            )}
            <Form className="form-main">
              <Form.Group className="mb-3 w-100" controlId="username">
                <Form.Control
                  aria-label="Enter Username"
                  type="text"
                  id="username"
                  placeholder="Enter username"
                  value={username}
                  onChange={handleUsernameChange}
                />
              </Form.Group>
            </Form>
            <Form className="form-main" onSubmit={handleSubmit}>
              <Form.Group className="mb-3 w-100" controlId="create-document">
                <Form.Control
                  aria-label="Enter Document Name"
                  type="text"
                  id="create-document"
                  placeholder="Enter Document Name"
                  onChange={(e) => setDocumentName(e.target.value)}
                />
              </Form.Group>
              <Button variant="warning" type="submit">
                <b>Create/Load Document</b>
              </Button>
            </Form>
            {documentNames.length > 0 && (
              <Card className="document-card mt-5">
                <Card.Header className="card-header">
                  List of Documents
                </Card.Header>
                <Card.Body className="flex-column align-items-start justify-content-center">
                  {documentNames.map((docName) => (
                    <ListGroup
                      variant="flush"
                      key={docName}
                      className="document-entry "
                    >
                      <ListGroup.Item className="d-flex align-items-center justify-content-between pb-1 px-0">
                        <Link
                          style={{ textDecoration: "none" }}
                          to={`/${docName}`}
                        >
                          {docName}
                        </Link>
                        <CloseButton
                          className="mx-0 p-0"
                          aria-label="Remove document"
                          aria-describedby={`Remove ${docName}`}
                          onClick={() => {
                            handleDeleteDocument(docName);
                          }}
                        />
                      </ListGroup.Item>
                      <div></div>
                    </ListGroup>
                  ))}
                </Card.Body>
              </Card>
            )}
          </Card>
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
