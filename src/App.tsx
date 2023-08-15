import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {
  Accordion,
  Button,
  Card,
  CloseButton,
  Container,
  Form,
  Nav,
  Navbar,
  NavDropdown,
} from "react-bootstrap";

import SpreadSheet from "./Components/SpreadSheet";
import SpreadSheetClient from "./Engine/SpreadSheetClient";
import "./styles/App.css";
import AccordionHeader from "react-bootstrap/esm/AccordionHeader";

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
        <Navbar
          fixed="top"
          bg="dark"
          data-bs-theme="dark"
          style={{
            height: "3rem",
          }}
        >
          <Container
            className="d-flex flex-row align-items-center justify-content-between"
            style={{
              maxWidth: "800px",
              height: "3rem",
            }}
          >
            <Navbar.Brand href="/">Learn and Excel</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                {documentNames.length > 0 && (
                  <NavDropdown
                    title="List of Documents"
                    id="basic-nav-dropdown"
                  >
                    {documentNames.map((docName) => (
                      <NavDropdown.Item
                        href={`/${docName}`}
                        key={docName}
                        className="d-flex align-items-center justify-content-between"
                      >
                        {docName}
                        <CloseButton
                          className="mx-0 p-0"
                          style={{ border: "none" }}
                          aria-label="Remove document"
                          aria-describedby={`Remove ${docName}`}
                          onClick={() => {
                            handleDeleteDocument(docName);
                          }}
                        />
                      </NavDropdown.Item>
                    ))}
                  </NavDropdown>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <header className="app-main-components">
          {window.location.pathname == "/" && (
            <p
              className="mt-5"
              style={{ fontSize: "1.5rem", textAlign: "center" }}
            >
              Welcome to <b className="app-name">Learn and Excel</b>
            </p>
          )}
          <Accordion
            defaultActiveKey="0"
            className="sheet-card d-flex flex-column mt-1 pb-0"
            style={{
              backgroundColor: "#ffc0c0",
              border: "3px solid black",
              boxShadow: "5px 10px 18px #888888",
              width: "702px",
              borderRadius: "10px",
            }}
          >
            <Accordion.Item
              eventKey="0"
              className="w-100"
              style={{ borderRadius: "10px" }}
            >
              <AccordionHeader className="section-header">
                Document Manager
              </AccordionHeader>
              <Accordion.Body
                className="d-flex flex-column align-items-center"
                style={{
                  backgroundColor: "#ffc0c0",
                  borderEndStartRadius: "8px",
                  borderEndEndRadius: "8px",
                }}
              >
                <Form className="form-main">
                  <Form.Group className="mb-3 w-50" controlId="username">
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
                  <Form.Group className="mb-3 w-50" controlId="create-document">
                    <Form.Control
                      aria-label="Enter Document Name"
                      type="text"
                      id="create-document"
                      placeholder="Enter Document Name"
                      onChange={(e) => setDocumentName(e.target.value)}
                    />
                  </Form.Group>
                  <Button variant="danger" type="submit">
                    <b>Create/Load Document</b>
                  </Button>
                </Form>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
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
