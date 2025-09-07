import Product from "../core/entities/Product";
import Supplier from "../core/entities/Supplier";
import PriceEntry from "../core/entities/PriceEntry";

const db = {
  products: [],
  suppliers: [],
  prices: [],
};

let nextId = { product: 1, supplier: 1 };

function genId(kind) { return String(nextId[kind]++); }

export function resetMockDb() {
  db.products = [];
  db.suppliers = [];
  db.prices = [];
  nextId = { product: 1, supplier: 1 };
}

export function uploadParsedRows(rows, uploaderMeta = {}) {
  const supplierName = uploaderMeta.supplierName || `Fournisseur ${genId("supplier")}`;
  const supplier = new Supplier({ id: genId("supplier"), name: supplierName });
  db.suppliers.push(supplier);

  for (const r of rows) {
    let product = db.products.find(p =>
      p.name.toLowerCase() === (r.name || "").toLowerCase() &&
      (p.reference || "") === (r.reference || "")
    );
    if (!product) {
      product = new Product({ id: genId("product"), name: r.name || "Sans nom", reference: r.reference || "" });
      db.products.push(product);
    }
    const priceEntry = new PriceEntry({
      productId: product.id,
      supplierId: supplier.id,
      price: Number(r.price || 0),
      date: r.date || new Date().toISOString(),
    });
    db.prices.push(priceEntry);
  }

}
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:4000/api";

export async function searchProducts(query, filters = {}) {
  try {
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    if (filters.supplier) params.set("supplier", filters.supplier);

    const url = `${BASE_URL}/products?${params.toString()}`;

    const res = await fetch(url, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error("HTTP error " + res.status);

    const data = await res.json();
    return (Array.isArray(data) ? data : []).map((p, i) => ({
      id: String(p.id ?? i + 1),
      name: p.name ?? "",
      reference: p.reference ?? "",
      supplier: p.supplier ?? p.supplierName ?? "",
      supplierId: p.supplierId ?? null,
      price: p.price ?? 0,
      date: p.date ?? null,
    }));
  } catch (err) {
    console.warn("Using mock data fallback:", err.message);

    // ---- FALLBACK MOCK DATA ----
    const MOCK = [
      { id: "1", name: "Laptop X1", reference: "LX100", supplier: "TechCorp", price: 1200, date: "2025-01-01" },
      { id: "2", name: "Laptop X2", reference: "LX200", supplier: "TechCorp", price: 1500, date: "2025-01-02" },
      { id: "3", name: "Mouse Pro", reference: "MP300", supplier: "PeriphCo", price: 50, date: "2025-01-03" },
      { id: "4", name: "Keyboard K1", reference: "KB101", supplier: "PeriphCo", price: 80, date: "2025-01-04" },
      { id: "5", name: "Laptop X1", reference: "LX100", supplier: "MegaSupply", price: 1100, date: "2025-01-05" },
      { id: "6", name: "Mouse Pro", reference: "MP300", supplier: "GadgetHouse", price: 45, date: "2025-01-06" },
    ];

    const q = (query || "").trim().toLowerCase();
    let results = MOCK;

    if (q) {
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.reference || "").toLowerCase().includes(q)
      );
    }
    if (filters.supplier) {
      const f = filters.supplier.toLowerCase();
      results = results.filter((p) => (p.supplier || "").toLowerCase().includes(f));
    }
    return results;
  }
}

// placeholder for future API call
export async function getPricesForProduct(productId) {
  try {
    const res = await fetch(`${BASE_URL}/products/${productId}/prices`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error("HTTP error " + res.status);

    return await res.json();
  } catch {
    // ⚡ fallback mock for price history with supplierId added
    return [
      { productId, supplier: "TechCorp", supplierId: "1", price: 1200, date: "2025-01-01" },
      { productId, supplier: "MegaSupply", supplierId: "2", price: 1100, date: "2025-01-05" },
    ];
  }
}

