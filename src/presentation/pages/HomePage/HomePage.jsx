import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { decodeMockToken } from "../AuthPage/mochToken";
import { useSelectedProducts } from "../../providers/SelectProductsContext";
import SearchPage from "../SearchPage/SearchPage.jsx";
import UploadPage from "../UploadPage/UploadPage.jsx";
import ComparisonPage from "../ComparisonPage/ComparisonPage.jsx";

export default function HomePage() {
  const navigate = useNavigate();
  const { selectedProducts, setSelectedProducts } = useSelectedProducts();
  const [searchResults, setSearchResults] = useState([]);

  const token = localStorage.getItem("token");
  const user = token ? decodeMockToken(token) : { name: "Guest", role: "user" };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("authenticated");
    setSelectedProducts([]);
    navigate("/login");
  };

  return (
    <div style={{ backgroundColor: "#f5f0eb", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg" style={{ backgroundColor: "#1E93AB", padding: "0.5rem 1rem" }}>
        <span className="navbar-brand fw-bold" style={{ color: "#3a2f26" }}>MonSite</span>
        <div className="ms-auto d-flex align-items-center">
          <span style={{ color: "#3a2f26", marginRight: "1rem", fontWeight: 500 }}>
            {user.name} ({user.role})
          </span>
          <button
            className="btn btn-dark btn-sm"
            onClick={handleLogout}
          >
            Déconnexion
          </button>
        </div>
      </nav>

      <div className="container py-4" style={{ maxWidth: "850px" }}>
        {/* Upload Section */}
        <div className="mb-4 p-3 rounded shadow" style={{ backgroundColor: "#1E93AB" }}>
          <UploadPage />
        </div>

        {/* Search Section */}
        <div className="mb-4 p-3 rounded shadow" style={{ backgroundColor: "#1E93AB" }}>
          <SearchPage setProducts={setSearchResults} />
        </div>

        {/* Comparison Section */}
        {selectedProducts.length > 0 && (
          <div className="mb-4 p-3 rounded shadow" style={{ backgroundColor: "#1E93AB" }}>
            <ComparisonPage products={searchResults.filter(p => selectedProducts.some(sp => sp.id === p.id))} />
          </div>
        )}
      </div>
    </div>
  );
}
