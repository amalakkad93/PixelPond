import { setLoading, setError } from "../../store/ui";
/**
 * Normalizes an array of objects into an object with a 'byId' structure.
 * @param {Array} items - The array of objects to normalize.
 * @param {string} idKey - The key in the objects that should be used as the ID.
 * @returns {Object} An object with 'byId' and 'allIds' properties.
 */
export const normalizeArray = (items, idKey = "id") => {
  if (!Array.isArray(items)) {
    console.warn("---normalizeArray called with non-array:", items);
    return { byId: {}, allIds: [] };
  }
  const byId = items.reduce((acc, item) => {
    acc[item[idKey]] = { ...item };
    return acc;
  }, {});
  const allIds = items.map((item) => item[idKey]);
  return { byId, allIds };
};


export const uploadFileWithProgress = (url, file, onProgress) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = (event.loaded / event.total) * 100;
        onProgress(progress);
      }
    };

    xhr.onload = () =>
      xhr.status === 200 ? resolve() : reject(new Error("Upload failed"));
    xhr.onerror = () => reject(new Error("Upload error"));
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.send(file);
  });
};
