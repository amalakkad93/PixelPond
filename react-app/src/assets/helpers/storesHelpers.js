import { setLoading, setError } from "../../store/ui";
/**
 * Normalizes an array of objects into an object with a 'byId' structure.
 * @param {Array} items - The array of objects to normalize.
 * @param {string} idKey - The key in the objects that should be used as the ID.
 * @returns {Object} An object with 'byId' and 'allIds' properties.
 */
// export const normalizeArray = (items, idKey = 'id') => {
//   const byId = items.reduce((acc, item) => {
//     acc[item[idKey]] = item;

//     return acc;
//   }, {});

//   const allIds = items.map(item => item[idKey]);

//   return { byId, allIds };
// };
export const normalizeArray = (items, idKey = 'id') => {
  console.log("---normalizeArray - items:", items);
  if (!Array.isArray(items)) {
    console.warn('---normalizeArray called with non-array:', items);
    return { byId: {}, allIds: [] };
  }
  const byId = items.reduce((acc, item) => {
    acc[item[idKey]] = { ...item };
    return acc;
  }, {});
  const allIds = items.map(item => item[idKey]);
  return { byId, allIds };
};


// export const normalizeArray = (items, idKey = 'id') => {
//   console.log("---normalizeArray - items:", items);

//   const byId = items.reduce((acc, item) => {
//     acc[item[idKey]] = { ...item }; // Deep copy each item
//     return acc;
//   }, {});

//   const allIds = items.map(item => item[idKey]);

//   return { byId, allIds };
// };
