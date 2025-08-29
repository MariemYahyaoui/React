export const ALLOWED_EXTS = ["pdf", "csv", "xls", "xlsx"];
export const MAX_FILE_SIZE = 20 * 1024 * 1024;

export function getExt(fileName) {
  const i = fileName.lastIndexOf(".");
  return i >= 0 ? fileName.slice(i + 1).toLowerCase() : "";
}

export function isAllowedExtension(file) {
  return ALLOWED_EXTS.includes(getExt(file.name));
}

export function isNonEmpty(file) {
  return file && file.size > 0;
}

export function isUnderMaxSize(file, max = MAX_FILE_SIZE) {
  return file.size <= max;
}

export function validateFile(file) {
  const errors = [];
  if (!isNonEmpty(file)) errors.push("Fichier vide ou illisible.");
  if (!isAllowedExtension(file))
    errors.push(`Extension non autorisée (.${getExt(file.name)}).`);
  if (!isUnderMaxSize(file)) errors.push("Fichier trop volumineux.");
  return { valid: errors.length === 0, errors };
}

export function validateFiles(files) {
  const accepted = [];
  const rejected = [];
  for (const f of files) {
    const res = validateFile(f);
    if (res.valid) accepted.push(f);
    else rejected.push({ file: f, errors: res.errors });
  }
  return { accepted, rejected };
}
