import { useState, useEffect } from "react";
import { fetchProducts } from "../../../application/usecases/fetchProducts";

export default function SearchPage({ onSelectProduct }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [supplierFilter, setSupplierFilter] = useState("");

  async function handleSearch(e) {
    e.preventDefault();
    if (!query) return;
    const data = await fetchProducts(query);
    setResults(data);
  }

  const filteredResults = supplierFilter
    ? results.filter((p) => (p.supplier || "").toLowerCase().includes(supplierFilter.toLowerCase()))
    : results;

  return (
    <div className="mb-4">
      <form onSubmit={handleSearch} className="d-flex mb-3">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Rechercher un produit..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <input
          type="text"
          className="form-control me-2"
          placeholder="Filtrer par fournisseur..."
          value={supplierFilter}
          onChange={(e) => setSupplierFilter(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">Rechercher</button>
      </form>
      <ul className="list-group">
        {filteredResults.map((p) => (
          <li
            key={p.id}
            className="list-group-item list-group-item-action"
            onClick={() => onSelectProduct(p)}
            style={{ cursor: "pointer" }}
          >
            {p.name} ({p.reference}) - Fournisseur: {p.supplier}
          </li>
        ))}
      </ul>
    </div>
  );
}
