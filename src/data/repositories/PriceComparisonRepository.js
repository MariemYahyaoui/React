import PriceComparisonPort from "../../core/ports/PriceComparisonPort";
import * as Api from "../Api";

export default class PriceComparisonRepository extends PriceComparisonPort {
  async getForProduct(productId) {
    return Api.getPricesForProduct(productId);
  }
}
