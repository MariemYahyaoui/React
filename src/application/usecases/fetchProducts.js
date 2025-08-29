
import ProductRepository from '../../data/repositories/ProductRepository';

export async function fetchProducts(query) {
  const repo = new ProductRepository();
  const results = await repo.search(query);
  return results;
}
