import ProductRepository from "../../data/repositories/ProductRepository";

export async function fetchProducts(query, filters = {}) {
  const repo = new ProductRepository();
  return repo.search(query, filters);
}
