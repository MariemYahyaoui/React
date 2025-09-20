import React, { useState, useRef } from "react";
import PdfProcessor from "../../../data/file-processor/PdfProcessor";
// Optional: CSV/XLSX processors can be added later

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  // Handle file selection
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
      alert("❌ Seuls les fichiers PDF, CSV ou Excel sont autorisés!");
      e.target.value = "";
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  // Handle file upload
  const handleFileUpload = async () => {
    if (!file) {
      alert("❌ Veuillez sélectionner un fichier avant de le télécharger.");
      return;
    }

    try {
      let processor;

      // Choose processor based on file type
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
          alert("❌ Type de fichier non pris en charge pour le moment.");
          return;
      }

      const data = await processor.parse(file);

      if (!data || data.length === 0) {
        alert("❌ Aucun produit trouvé dans le fichier. Échec du téléchargement.");
        return;
      }

      alert(`✅ ${data.length} produits traités avec succès.`);

    } catch (err) {
      alert("❌ Erreur lors du traitement du fichier :" + err.message);
    } finally {
      // Reset file input and state
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="mb-4">
      {/* File Upload */}
      <div className="d-flex mb-3">
        <input
          type="file"
          className="form-control me-2"
          accept=".pdf,.csv,.xlsx,.xls"
          onChange={handleFileChange}
          ref={fileInputRef}
        />
       <button
  className="btn"
  onClick={handleFileUpload}
  disabled={!file}
  style={{
    backgroundColor: "#DCDCDC",
    color: "#000", // black text for contrast
    border: "1px solid #ccc"
  }}
>
  Télécharger
</button>

      </div>
    </div>
  );
}
