export const createFormData = (data: { [key: string]: any }) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    Array.isArray(data[key])
      ? formData.append(key, JSON.stringify(data[key]))
      : formData.append(key, data[key]);
  });
  return formData;
};
