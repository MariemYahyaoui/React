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
    let product = db.products.find(p => p.name.toLowerCase() === (r.name || "").toLowerCase() && (p.reference || "") === (r.reference || ""));
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

export function searchProducts(query, filters = {}) {
  const q = (query || "").trim().toLowerCase();
  let results = db.products.slice();
  if (q) {
    results = results.filter(p => p.name.toLowerCase().includes(q) || (p.reference || "").toLowerCase().includes(q));
  }
  if (filters.supplierId) {
    const ids = new Set(db.prices.filter(pe => pe.supplierId === filters.supplierId).map(pe => pe.productId));
    results = results.filter(p => ids.has(p.id));
  }

  // enrichir les produits avec prix et date mock
  return results.map(p => {
    const entries = db.prices.filter(pe => pe.productId === p.id);
    const latest = entries.reduce((a, b) => new Date(a.date) > new Date(b.date) ? a : b, { date: null, price: 0 });
    return { ...p, price: latest.price, date: latest.date };
  });
}

export function getPricesForProduct(productId) {
  return db.prices.filter(pe => pe.productId === productId);
}
