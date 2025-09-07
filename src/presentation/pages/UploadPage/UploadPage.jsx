import { useState, useRef } from "react";
import { fetchProducts } from "../../../application/usecases/fetchProducts";
import PdfProcessor from "../../../data/file-processor/PdfProcessor";

export default function SearchPage({ onSelectProduct }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      setFile(null);
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "text/csv",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // XLSX
      "application/vnd.ms-excel", // XLS
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      alert("Only PDF or CSV files are allowed!");
      e.target.value = "";
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const handleFileUpload = async () => {
    if (!file) {
      alert("❌ Please select a file before uploading.");
      return;
    }

    try {
      let processor;

      switch (file.type) {
        case "application/pdf":
          processor = new PdfProcessor();
          break;
        case "text/csv": {
          const CsvProcessor = (await import("../../../data/file-processor/csvProcessor")).default;
          processor = new CsvProcessor();
          break;
        }
        default:
          alert("❌ Unsupported file type.");
          return;
      }

      const data = await processor.parse(file);

      if (!data || data.length === 0) {
        alert("❌ No products found in file. Upload failed.");
        return;
      }

      alert(`✅ ${data.length} products processed from file`);

    } catch (err) {
      alert("❌ Error processing file: " + err.message);
    } finally {
      // Always reset input so state is clean
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
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
          accept=".pdf,.csv"
          onChange={handleFileChange}
          ref={fileInputRef}
        />
        <button
          className="btn btn-primary"
          onClick={handleFileUpload}
          disabled={!file} // Cannot click without a file
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
              <span>
                {p.name} ({p.reference})
              </span>
              <span className="badge bg-primary rounded-pill">
                {p.price}€
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
