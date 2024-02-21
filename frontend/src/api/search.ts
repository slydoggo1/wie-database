/**
 * Wrapper for axios calls
 */
import axios from 'axios';
import { SEARCH_URL } from './urls';

export const getSearchResults = (
  generalSearch: string,
  specialisations: string[],
  interests: string[],
  pageNumber: number,
) => {
  return axios.post(`${SEARCH_URL}`, {
    pageNumber,
    limit: 12,
    generalSearch,
    specialisations,
    interests,
  });
};

export const getSpecialisations = () => {
  return axios.get(`${SEARCH_URL}/topics`);
};
