import React, { useState, useMemo, useCallback } from "react";
import { fetchProducts } from "../../../application/usecases/fetchProducts.js";
import { useSelectedProducts } from "../../providers/SelectProductsContext";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [supplierFilter, setSupplierFilter] = useState("");
  const { selectedProducts, setSelectedProducts } = useSelectedProducts();

  // Faster lookup for selected IDs
  const selectedIds = useMemo(() => new Set(selectedProducts.map((p) => p.id)), [selectedProducts]);

  // Handle search
  const handleSearch = async (e) => {
    e?.preventDefault?.();
    try {
      const data = await fetchProducts(query);
      setResults(data || []);
      setSupplierFilter("");
    } catch (err) {
      console.error("Erreur lors de la recherche:", err);
      setResults([]);
    }
  };

  // Toggle product selection (optimized)
  const toggleSelectProduct = useCallback(
    (product) => {
      if (selectedIds.has(product.id)) {
        setSelectedProducts((prev) => prev.filter((p) => p.id !== product.id));
      } else {
        setSelectedProducts((prev) => [...prev, product]);
      }
    },
    [selectedIds, setSelectedProducts]
  );

  // Supplier filter options
  const supplierOptions = useMemo(() => {
    return Array.from(
      new Set(results.map((p) => p.supplier).filter(Boolean))
    ).sort((a, b) => a.localeCompare(b));
  }, [results]);

  // Apply supplier filter
  const filteredResults = useMemo(() => {
    if (!supplierFilter) return results;
    return results.filter(
      (p) => (p.supplier || "").toLowerCase() === supplierFilter.toLowerCase()
    );
  }, [results, supplierFilter]);

  return (
    <div className="mb-4">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="d-flex mb-3 gap-2">
        <input
          type="text"
          className="form-control"
          placeholder="Rechercher par nom ou référence…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
  type="submit"
  className="btn"
  style={{
    backgroundColor: "#DCDCDC",
    color: "#000", // black text
    border: "1px solid #ccc",
  }}
>
  Rechercher
</button>

<button
  type="button"
  className="btn"
  onClick={() => {
    setQuery("");
    setResults([]);
    setSupplierFilter("");
  }}
  style={{
    backgroundColor: "#DCDCDC",
    color: "#000",
    border: "1px solid #ccc",
  }}
>
  Réinitialiser
</button>

      </form>

      {/* Supplier Filter */}
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

      {/* Results List */}
      <ul className="list-group">
        {filteredResults.map((p) => {
          const isSelected = selectedIds.has(p.id);
          return (
            <li
              key={p.id}
              className={`list-group-item d-flex justify-content-between align-items-center ${
                isSelected ? "list-group-item-success" : ""
              }`}
              style={{ cursor: "pointer" }}
              onClick={() => toggleSelectProduct(p)} // click anywhere to select
            >
              <div>
                {p.name} ({p.reference}) — Fournisseur : {p.supplier || "—"} — Prix : {p.price} €
              </div>
              <button
                className={`btn btn-sm ${isSelected ? "btn-danger" : "btn-success"}`}
                onClick={(e) => {
                  e.stopPropagation(); // prevent double toggle
                  toggleSelectProduct(p);
                }}
              >
                {isSelected ? "Désélectionner" : "Sélectionner"}
              </button>
            </li>
          );
        })}

        {!filteredResults.length && results.length > 0 && (
          <li className="list-group-item text-muted">
            Aucun produit pour ce filtre fournisseur.
          </li>
        )}

        {!results.length && (
          <li className="list-group-item text-muted centered">
            Lancez une recherche pour voir les produits.
          </li>
        )}
      </ul>
    </div>
  );
}
