import { useMemo } from "react";
import { useSelectedProducts } from "../../providers/SelectProductsContext";

export default function ComparisonPage() {
  const { selectedProducts } = useSelectedProducts();

  // 🔹 Compute best product locally (temporary)
  const bestProduct = useMemo(() => {
    if (!selectedProducts || selectedProducts.length === 0) return null;

    return [...selectedProducts].sort((a, b) => {
      if (a.price === b.price) {
        // If same price, compare by date
        return new Date(a.date) - new Date(b.date);
      }
      return a.price - b.price; // Lower price first
    })[0];
  }, [selectedProducts]);

  if (!selectedProducts || selectedProducts.length === 0) {
    return (
      <div className="p-3">
        <div className="alert alert-warning">
          Sélectionnez des produits pour comparer.
        </div>
      </div>
    );
  }

  return (
    <div className="p-3">
      {/* 🔹 Best Product Section */}
      {bestProduct && (
        <div className="alert alert-success">
          <h5>Meilleur produit trouvé</h5>
          <p>
            <strong>{bestProduct.name}</strong> ({bestProduct.reference}) <br />
            Fournisseur : {bestProduct.supplier || "—"} <br />
            Prix : {bestProduct.price} € <br />
            Date : {bestProduct.date || "—"}
          </p>
        </div>
      )}

      {/* 🔹 List of selected products */}
      <h5 className="mt-4">Produits sélectionnés :</h5>
      <ul className="list-group">
        {selectedProducts.map((p) => (
          <li key={p.id} className="list-group-item">
            {p.name} ({p.reference}) — {p.supplier || "—"} — {p.price} € —{" "}
            {p.date || "—"}
          </li>
        ))}
      </ul>
    </div>
  );
}
