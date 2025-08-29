import React, { useState } from "react";
import { uploadFile } from '../../../application/usecases/UploadFile';
import { fetchProducts } from '../../../application/usecases/fetchProducts';
import { compareProducts } from '../../../application/usecases/compareProducts';
import { useSelectedProducts } from '../../providers/SelectProductsContext';

const HomePage = () => {
  const [file, setFile] = useState(null);
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const { selectedProducts, setSelectedProducts } = useSelectedProducts();

  const [comparisonResult, setComparisonResult] = useState(null);
  const [error, setError] = useState("");

  // Upload
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const allowedTypes = [
      "application/pdf",
      "text/csv",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      alert("Seuls les fichiers PDF, CSV ou XLSX sont autorisés !");
      e.target.value = "";
      return;
    }

    setFile(selectedFile);
  };

  const handleFileUpload = async () => {
    if (!file) return alert("Veuillez sélectionner un fichier d'abord !");
    try {
      const result = await uploadFile(file);
      alert(result.message || "Fichier téléchargé avec succès !");
    } catch (err) {
      alert("Erreur lors du téléchargement : " + err.message);
    }
  };

  // Recherche
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    try {
      const results = await fetchProducts(query.trim(), {});
      setProducts(results);
    } catch (err) {
      alert("Erreur lors de la recherche : " + err.message);
    }
  };

  // Sélection produit
  const toggleSelectProduct = (product) => {
    if (selectedProducts.find((p) => p.id === product.id)) {
      setSelectedProducts(selectedProducts.filter((p) => p.id !== product.id));
    } else if (selectedProducts.length < 2) {
      setSelectedProducts([...selectedProducts, product]);
    } else {
      alert("Vous ne pouvez sélectionner que deux produits pour comparer.");
    }
  };

  // Comparaison
  const handleCompare = async () => {
    if (selectedProducts.length !== 2) {
      alert("Veuillez sélectionner exactement deux produits pour comparer.");
      return;
    }
    setError("");
    try {
      const l = await compareProducts(selectedProducts[0].id);
      const r = await compareProducts(selectedProducts[1].id);

      // Déterminer le meilleur prix et dernière sortie
      const allPrices = [...l.prices, ...r.prices];
      const minPriceEntry = allPrices.reduce((prev, curr) => prev.price < curr.price ? prev : curr);
      const latestDateEntry = allPrices.reduce((prev, curr) => new Date(prev.date) > new Date(curr.date) ? prev : curr);

      setComparisonResult({
        left: l,
        right: r,
        bestPrice: minPriceEntry,
        latestDate: latestDateEntry,
      });
    } catch (err) {
      setError(err.message || "Erreur lors de la comparaison");
    }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString("fr-FR") : "N/A";

  return (
    <div className="container py-5">
      <h1 className="text-center text-primary mb-5">Accueil</h1>

      {/* Upload */}
      <div className="d-flex justify-content-center mb-4">
        <input
          type="file"
          className="form-control w-auto me-2"
          accept=".pdf,.csv,.xlsx"
          onChange={handleFileChange}
        />
        <button className="btn btn-primary" onClick={handleFileUpload} disabled={!file}>
          Télécharger
        </button>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="d-flex justify-content-center mb-5">
        <input
          type="text"
          className="form-control w-50 me-2"
          placeholder="Rechercher un produit..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="btn btn-success">Rechercher</button>
      </form>

      {/* Résultats */}
      <div className="row">
        {products.map((p) => (
          <div key={p.id} className="col-md-6 mb-4">
            <div className="card shadow-sm h-100">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title">{p.name}</h5>
                  <p className="card-text text-muted mb-1">{p.supplier}</p>
                  <p className="card-text fw-bold">Prix: {p.price?.toFixed(2)}€</p>
                  <p className="card-text">Sortie: {formatDate(p.date)}</p>

                  {comparisonResult?.bestPrice?.productId === p.id && (
                    <span className="badge bg-success me-2">Meilleur prix</span>
                  )}
                  {comparisonResult?.latestDate?.productId === p.id && (
                    <span className="badge bg-info">Dernière sortie</span>
                  )}
                </div>
                <button
                  onClick={() => toggleSelectProduct(p)}
                  className={`btn ${
                    selectedProducts.find((sp) => sp.id === p.id) ? "btn-danger" : "btn-success"
                  }`}
                >
                  {selectedProducts.find((sp) => sp.id === p.id) ? "Désélectionner" : "Sélectionner"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sélection pour comparaison */}
      {selectedProducts.length > 0 && (
        <div className="mb-4">
          <h4 className="text-secondary">Produits sélectionnés pour comparaison :</h4>
          <ul className="list-group list-group-horizontal overflow-auto mb-3">
            {selectedProducts.map((p) => (
              <li key={p.id} className="list-group-item flex-shrink-0 me-2">
                {p.name} — {p.price?.toFixed(2)}€ — {formatDate(p.date)}
              </li>
            ))}
          </ul>
          <button className="btn btn-warning" onClick={handleCompare}>
            Comparer
          </button>
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
};

export default HomePage;
