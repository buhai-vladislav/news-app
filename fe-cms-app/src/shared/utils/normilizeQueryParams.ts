export const cleanQueryParams = (
  params: Record<string, any>,
): Record<string, any> => {
  const cleanedParams: Record<string, any> = {};

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== 'all' && value !== '') {
      cleanedParams[key] = value;
    }
  }

  return cleanedParams;
};
