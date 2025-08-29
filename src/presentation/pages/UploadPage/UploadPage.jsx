import { useState } from "react";
import { fetchProducts } from "../../../application/usecases/fetchProducts";
import PdfProcessor from "../../../data/file-processor/PdfProcessor";

export default function SearchPage({ onSelectProduct }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const allowedTypes = [
      "application/pdf",
      "text/csv",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      alert("Only PDF, CSV, or XLSX files are allowed!");
      e.target.value = "";
      return;
    }

    setFile(selectedFile);
  };

  const handleFileUpload = async () => {
    if (!file) return alert("Please select a file first.");
    try {
      const processor = new PdfProcessor();
      const data = await processor.parse(file);
      alert(`${data.length} products processed from file`);
    } catch (err) {
      alert("Error processing file: " + err.message);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;
    const data = await fetchProducts(query);
    setResults(data);
  };

  return (
    <div className="mb-4">
      {/* File Upload */}
      <div className="d-flex mb-3">
        <input
          type="file"
          className="form-control me-2"
          accept=".pdf,.csv,.xlsx"
          onChange={handleFileChange}
        />
        <button
          className="btn btn-primary"
          onClick={handleFileUpload}
          disabled={!file}
        >
          Upload
        </button>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="d-flex mb-3">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Search product..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="btn btn-success">
          Search
        </button>
      </form>

      {/* Results */}
      {results.length > 0 && (
        <ul className="list-group">
          {results.map((p) => (
            <li
              key={p.id}
              className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
              onClick={() => onSelectProduct(p)}
              style={{ cursor: "pointer" }}
            >
              <span>{p.name} ({p.reference})</span>
              <span className="badge bg-primary rounded-pill">{p.price}€</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
