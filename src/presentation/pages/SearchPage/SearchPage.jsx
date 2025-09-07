import React, { useState, useMemo } from "react";
import  {fetchProducts}  from "../../../application/usecases/fetchProducts.js";

export default function SearchPage({ onSelectProduct }) {
  const [query, setQuery] = useState("");

  const [results, setResults] = useState([]);
  const [supplierFilter, setSupplierFilter] = useState("");

  async function handleSearch(e) {
    e?.preventDefault?.();
    const data = await fetchProducts(query);
    setResults(data || []);
    setSupplierFilter("");
  }

  const supplierOptions = useMemo(() => {
    return Array.from(
      new Set(results.map((p) => p.supplier).filter(Boolean))
    ).sort((a, b) => a.localeCompare(b));
  }, [results]);

  const filteredResults = useMemo(() => {
    if (!supplierFilter) return results;
    return results.filter(
      (p) => (p.supplier || "").toLowerCase() === supplierFilter.toLowerCase()
    );
  }, [results, supplierFilter]);

  return (
    <div className="mb-4">
      <form onSubmit={handleSearch} className="d-flex mb-3 gap-2">
        <input
          type="text"
          className="form-control"
          placeholder="Rechercher par nom ou référence…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">
          Rechercher
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => {
            setQuery("");
            setResults([]);
            setSupplierFilter("");
          }}
        >
          Réinitialiser
        </button>
      </form>

      <div className="d-flex align-items-center gap-2 mb-3">
        <label className="form-label m-0">Filtrer par fournisseur :</label>
        <select
          className="form-select"
          style={{ maxWidth: 320 }}
          value={supplierFilter}
          onChange={(e) => setSupplierFilter(e.target.value)}
        >
          <option value="">Tous les fournisseurs</option>
          {supplierOptions.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <ul className="list-group">
        {filteredResults.map((p) => (
          <li
            key={p.id}
            className="list-group-item list-group-item-action"
            onClick={() => onSelectProduct?.(p)}
            style={{ cursor: "pointer" }}
          >
            {p.name} ({p.reference}) — Fournisseur : {p.supplier || "—"} — Prix : {p.price} €
          </li>
        ))}

        {!filteredResults.length && results.length > 0 && (
          <li className="list-group-item text-muted">
            Aucun produit pour ce filtre fournisseur.
          </li>
        )}

        {!results.length && (
          <li className="list-group-item text-muted">
            Lancez une recherche pour voir les produits.
          </li>
        )}
      </ul>
    </div>
  );
}
