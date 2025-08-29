import FileProcessorPort from "../../core/ports/FileProcessorPort";
import * as XLSX from "xlsx";

export default class XlsxProcessor extends FileProcessorPort {
  async parse(file) {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });
    return json.map((row) => ({
      name: row.name || row.product || row.nom || row.Name || "",
      reference: row.reference || row.ref || "",
      price: row.price || row.prix || row.Price || 0,
      date: row.date || new Date().toISOString(),
      supplierName: row.supplier || undefined,
    }));
  }
}
