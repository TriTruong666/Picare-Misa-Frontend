/**
 * Utility functions for handling URL parameters
 */

/**
 * Build URL with parameters while preserving existing ones
 * @param pathname - The base pathname
 * @param params - Current URLSearchParams
 * @param newParams - New parameters to add/update
 * @returns Formatted URL string
 */
export const buildUrlWithParams = (
  pathname: string,
  params: URLSearchParams,
  newParams: Record<string, string>
): string => {
  const newSearchParams = new URLSearchParams(params);

  // Add new parameters
  Object.entries(newParams).forEach(([key, value]) => {
    if (value) {
      newSearchParams.set(key, value);
    } else {
      newSearchParams.delete(key);
    }
  });

  const queryString = newSearchParams.toString();
  return queryString ? `${pathname}?${queryString}` : pathname;
};

/**
 * Remove specific parameter from URL while preserving others
 * @param pathname - The base pathname
 * @param params - Current URLSearchParams
 * @param paramToRemove - Parameter key to remove
 * @returns Formatted URL string
 */
export const removeUrlParam = (
  pathname: string,
  params: URLSearchParams,
  paramToRemove: string
): string => {
  const newSearchParams = new URLSearchParams(params);
  newSearchParams.delete(paramToRemove);

  const queryString = newSearchParams.toString();
  return queryString ? `${pathname}?${queryString}` : pathname;
};

/**
 * Get parameter value safely with fallback
 * @param params - URLSearchParams
 * @param key - Parameter key
 * @param fallback - Fallback value if parameter doesn't exist
 * @returns Parameter value or fallback
 */
export const getParamValue = (
  params: URLSearchParams,
  key: string,
  fallback: string = ""
): string => {
  return params.get(key) || fallback;
};

/**
 * Check if parameter exists
 * @param params - URLSearchParams
 * @param key - Parameter key
 * @returns Boolean indicating if parameter exists
 */
export const hasParam = (params: URLSearchParams, key: string): boolean => {
  return params.has(key);
};

/**
 * Get all parameters as an object
 * @param params - URLSearchParams
 * @returns Object with all parameters
 */
export const getAllParams = (params: URLSearchParams): Record<string, string> => {
  const result: Record<string, string> = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
};

/**
 * Merge multiple parameter objects
 * @param params - Array of parameter objects
 * @returns Merged parameter object
 */
export const mergeParams = (...params: Record<string, string>[]): Record<string, string> => {
  return params.reduce((acc, curr) => ({ ...acc, ...curr }), {});
};
