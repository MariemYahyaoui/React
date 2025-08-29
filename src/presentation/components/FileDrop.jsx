import { useRef, useState } from "react";
import { ALLOWED_EXTS, validateFiles } from "../../shared/lib/validators";

export default function FileDrop({ onValidFiles }) {
  const inputRef = useRef(null);
  const [rejected, setRejected] = useState([]);

  function handleFiles(list) {
    const files = Array.from(list || []);
    const { accepted, rejected } = validateFiles(files);
    setRejected(rejected);
    if (accepted.length) onValidFiles?.(accepted);
  }

  function onInputChange(e) {
    handleFiles(e.target.files);
    e.target.value = null;
  }

  function onDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    handleFiles(e.dataTransfer.files);
  }

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className="border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer hover:bg-gray-50"
        onClick={() => inputRef.current?.click()}
        role="button"
        aria-label="Déposer ou sélectionner des fichiers"
      >
        <p className="font-medium">Glisser-déposer vos fichiers ici</p>
        <p className="text-sm text-gray-500">ou cliquez pour parcourir</p>
        <p className="text-xs mt-2 text-gray-500">
          Extensions autorisées : {ALLOWED_EXTS.map((e) => "." + e).join(", ")}
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          accept={ALLOWED_EXTS.map((e) => "." + e).join(",")}
          onChange={onInputChange}
        />
      </div>

      {rejected.length > 0 && (
        <div className="rounded-xl border border-rose-200 bg-black-50 p-3">
          <div className="font-semibold mb-2">Fichiers rejetés</div>
          <ul className="text-sm list-disc pl-5 space-y-1">
            {rejected.map((r, i) => (
              <li key={i}>
                <span className="font-medium">{r.file.name}</span> — {r.errors.join(" ; ")}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}