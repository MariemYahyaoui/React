import { uploadParsedRows } from "./Api";

export function seedMockData() {
  uploadParsedRows([
    { name: "Laptop X1", reference: "LX100", price: 1200, supplierName: "TechCorp" },
    { name: "Laptop X2", reference: "LX200", price: 1500, supplierName: "TechCorp" },
    { name: "Mouse Pro", reference: "MP300", price: 50, supplierName: "PeriphCo" },
    { name: "Keyboard K1", reference: "KB101", price: 80, supplierName: "PeriphCo" },
  ]);
}
