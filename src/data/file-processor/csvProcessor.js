import FileProcessorPort from "../../core/ports/FileProcessorPort";
import Papa from "papaparse";

export default class CsvProcessor extends FileProcessorPort {
  async parse(file) {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const normalized = results.data.map((row) => ({
            name: row.name || row.product || row.nom || row.reference || "",
            reference: row.reference || row.ref || "",
            price: row.price || row.prix || row.cost || 0,
            date: row.date || new Date().toISOString(),
            supplierName: row.supplier || undefined,
          }));
          resolve(normalized);
        },
        error: (err) => reject(err),
      });
    });
  }
}
