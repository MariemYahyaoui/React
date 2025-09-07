// Mock file upload, replace later with backend integration
export const uploadFile = async (file) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: "Fichier téléchargé avec succès ",
        fileName: file.name,
      });
    }, 1000);
  });
};
