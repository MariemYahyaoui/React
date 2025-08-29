export default function UploadResults({ results }) {
  if (!results || !results.length) return null;
  return (
    <div className="mt-4">
      <div className="font-semibold mb-2">Résultats d'import</div>
      <ul className="text-sm list-disc pl-5 space-y-1">
        {results.map((r, i) => (
          <li key={i}>
            <span className="font-medium">{r.fileName}</span> — {r.status}
          </li>
        ))}
      </ul>
    </div>
  );
}