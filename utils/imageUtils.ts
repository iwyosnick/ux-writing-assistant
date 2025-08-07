export const fileToBase64 = (file: File): Promise<{ mimeType: string, data: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // remove the "data:mime/type;base64," prefix
        const data = result.split(',')[1];
        resolve({ mimeType: file.type, data });
      };
      reader.onerror = (error) => reject(error);
    });
};
