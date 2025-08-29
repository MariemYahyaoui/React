import axios from "axios";

export const http = axios.create({
  baseURL: "https://mockapi.io/projects/68ac399f7a0bbe92cbb9b587#",
  withCredentials: true,
});

http.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err)
);

export async function uploadSupplierFiles(files, onProgress) {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  const response = await http.post("/upload", formData, {
    onUploadProgress: (event) => {
      if (onProgress) {
        const percent = Math.round((event.loaded * 100) / event.total);
        onProgress(percent);
      }
    },
  });
  return response.data;
}