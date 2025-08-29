import FileUploadPort from "../../core/ports/FileUploadPort";
import * as Api from "../Api";

export default class FileUploadRepository extends FileUploadPort {
  async upload(parsedRows, meta = {}) {
    // For now, mockApi stores the parsed rows and returns a summary
    const res = Api.uploadParsedRows(parsedRows, meta);
    return res; // { supplier, storedCount }
  }
}
