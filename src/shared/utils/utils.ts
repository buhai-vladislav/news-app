/**
 * Copy the input object and remove any undefined properties.
 *
 * @param {T} obj - the input object of generic type T
 * @return {T} a new object of type T with undefined properties removed
 */
export const removeUndfined = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};
