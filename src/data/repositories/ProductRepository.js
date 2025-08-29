import ProductRepositoryPort from "../../core/ports/ProductRepositoryPort";
import * as Api from "../Api";

export default class ProductRepository extends ProductRepositoryPort {
  async search(query, filters = {}) {
    // returns array of plain product objects
    return Api.searchProducts(query, filters);
  }
}
