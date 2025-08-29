export default class ProductRepositoryPort {
  async search(query, filters = {}) {
    throw new Error("search(query, filters) not implemented");
  }
}
