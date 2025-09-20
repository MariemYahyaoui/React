import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert, Card } from "react-bootstrap";
import { generateMockToken, decodeMockToken } from './mochToken'; 

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      if (username && password) {
        const token = generateMockToken(username);
        localStorage.setItem("token", token);
        console.log("Utilisateur connecté :", decodeMockToken(token).nameidentifier);
        navigate("/home");
        return;
      } else {
        setError("Veuillez remplir tous les champs.");
      }
    } catch (err) {
      setError("Nom d'utilisateur ou mot de passe invalide.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #f0f7fc, #1E93AB)", // joyful gradient
        padding: "20px",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "40px",
          borderRadius: "20px",
          boxShadow: "0 12px 25px rgba(0,0,0,0.15)",
          backgroundColor: "#FDF6F0", // soft pastel nude
        }}
      >
        <h2 className="text-center mb-4" style={{ color: "#444", fontWeight: "600" }}>
          Bienvenue !
        </h2>
        

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3" controlId="formUsername">
            <Form.Label style={{ color: "#555" }}>Nom d'utilisateur</Form.Label>
            <Form.Control
              type="text"
              placeholder="Entrez votre nom d'utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                borderRadius: "10px",
                borderColor: "#ccc",
                padding: "12px",
              }}
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="formPassword">
            <Form.Label style={{ color: "#555" }}>Mot de passe</Form.Label>
            <Form.Control
              type="password"
              placeholder="Entrez votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                borderRadius: "10px",
                borderColor: "#ccc",
                padding: "12px",
              }}
            />
          </Form.Group>

          <Button
            type="submit"
            className="w-100"
            style={{
              backgroundColor: "#1E93AB",
              color: "#f8f3f3ff",
              border: "none",
              borderRadius: "12px",
              fontWeight: "500",
              padding: "12px",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#1E93AB")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#1E93AB")}
          >
            Se connecter
          </Button>
        </Form>

      
      </Card>
    </div>
  );
}

export default LoginPage;
