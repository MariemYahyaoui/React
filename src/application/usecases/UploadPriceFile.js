export async function uploadPriceFile(fileProcessor, file) {
  try {
    const rows = await fileProcessor.parse(file);
    const errors = [];

    const validRows = rows.filter((row, i) => {
      if (!row.name || isNaN(row.price)) {
        errors.push(`Ligne ${i + 1} invalide`);
        return false;
      }
      return true;
    });

    return {
      success: errors.length === 0,
      data: validRows,
      errors: errors.length ? errors : undefined,
    };
  } catch (err) {
    return { success: false, data: [], errors: [err.message] };
  }
}
