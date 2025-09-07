import FileProcessorPort from "../../core/ports/FileProcessorPort";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";

/**
 * PdfProcessor:
 * - Uses pdfjs-dist to extract text from each page.
 * - Heuristically splits text into "lines" and tries to detect price tokens.
 * - Returns normalized rows: { name, reference, price, date, supplierName? }
 *
 * Notes:
 * - PDF layouts vary widely. This parser is intentionally tolerant:
 *   it looks for the last numeric token in a line to treat as price.
 * - Improve the heuristics if your PDFs have a consistent format (e.g., columns).
 */
export default class PdfProcessor extends FileProcessorPort {
  async parse(file) {
    // load pdf document
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    const pagesText = [];
    for (let p = 1; p <= pdf.numPages; p++) {
      const page = await pdf.getPage(p);
      const textContent = await page.getTextContent();
      // join text items; provide spaces between tokens to avoid concatenation
      const pageText = textContent.items.map((it) => it.str).join(" ");
      pagesText.push(pageText);
    }

    // Join pages with newline markers so we can split by lines later
    const fullText = pagesText.join("\n");

    // Heuristic split: try to split into lines by actual newlines or by long sequences of two+ spaces.
    // Also split on sequences like "  -  " or " : "
    const rawLines = fullText
      .split(/\r?\n| {2,}| - | • | \| /) // cleaned regex (removed useless escapes)
      .map((s) => s.trim())
      .filter(Boolean);

    const rows = [];
    for (const raw of rawLines) {
      // Try to find a price token (number with optional thousands separators, decimals)
      // Accept formats like: 1234.56 or 1,234.56 or 1234,56 or 1234
      const priceMatch = raw.match(/([+-]?\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{1,2})?)/g);
      if (priceMatch && priceMatch.length > 0) {
        const lastToken = priceMatch[priceMatch.length - 1];

        // normalize number: replace comma decimal with dot, remove thousand separators
          let normalized = lastToken.replace(/\s/g, "");
        if (normalized.includes(",") && normalized.includes(".")) {
          const lastDot = normalized.lastIndexOf(".");
          const lastComma = normalized.lastIndexOf(",");
          if (lastComma > lastDot) {
            // comma decimal
              normalized = normalized.replace(/\./g, "").replace(",", ".");
          } else {
            // dot decimal
            normalized = normalized.replace(/,/g, "");
          }
        } else if (normalized.includes(",")) {
          // treat comma as decimal
            normalized = normalized.replace(/\./g, "").replace(",", ".");
        } else {
          // only dots or only digits — remove any thousand separators (commas)
          normalized = normalized.replace(/,/g, "");
        }

        const price = Number(parseFloat(normalized));
        if (!isNaN(price)) {
          // remove the price token from the raw line to get candidate name/reference
            const namePart = raw.replace(lastToken, "").replace(/\s{2,}/g, " ").trim();

          // attempt to extract a reference: look for tokens like (REF: XYZ) or [REF] or sequences of letters/numbers
          let reference = "";
          const refMatch = namePart.match(
            /(?:ref[:\s]*|réf[:\s]*|\bREF[:\s]*|\bRef[:\s]*|\(|\[)([A-Za-z0-9-_]{2,})/i
          );
          if (refMatch && refMatch[1]) {
            reference = refMatch[1];
          } else {
            const codeMatch = namePart.match(/([A-Z0-9-]{3,})$/);
            if (codeMatch) reference = codeMatch[1];
          }

          const name = namePart.replace(/[()\[\]]/g, "").trim();

          rows.push({
            name: name || reference || "Unknown",
            reference: reference || "",
            price,
            date: new Date().toISOString(),
            supplierName: undefined,
          });
        }
      }
    }

    if (rows.length === 0) {
      throw new Error(
        "Aucune ligne de prix détectée dans le PDF.Le format de fichier peut ne pas être compatible avec l'analyse automatique."
      );
    }

    return rows;
  }
}
