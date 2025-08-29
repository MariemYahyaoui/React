export default class PriceEntry {
  constructor({ productId, supplierId, price, date }) {
    this.productId = String(productId);
    this.supplierId = String(supplierId);
    this.price = Number(price);
    this.date = date ? new Date(date) : new Date();
  }
}
