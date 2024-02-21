/**
 * API URLs accessed from various frontend locations
 */

const BASE_URL = import.meta.env.VITE_API_URL;

export const USERS_URL = `${BASE_URL}/users`;
export const ENGINEERS_URL = `${BASE_URL}/engineers`;
export const SEARCH_URL = `${BASE_URL}/search`;
