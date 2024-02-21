/**
 * Wrapper for axios calls
 */
import axios from 'axios';
import { ENGINEERS_URL, USERS_URL } from './urls';

export const createNewAdmin = (firstName: string, lastName: string, email: string, token: string | null) => {
  return axios.post(
    `${USERS_URL}/signup/admin`,
    { firstName, lastName, email },
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
};

export const adminGetAllUsers = async (token: string | null, startAfter?: string, limit?: number, orderBy?: string) => {
  const response = await axios.get(`${USERS_URL}/admin/get-all-users`, {
    headers: { Authorization: `Bearer ${token}` },
    params: {
      startAfter,
      limit,
      orderBy,
    },
  });

  return response;
};

export const adminGetAllEngineers = async (
  token: string | null,
  startAfter?: string,
  limit?: number,
  orderBy?: string,
) => {
  const response = await axios.get(`${ENGINEERS_URL}/admin/get-all-engineers`, {
    headers: { Authorization: `Bearer ${token}` },
    params: {
      startAfter,
      limit,
      orderBy,
    },
  });

  return response;
};

export const deleteEngineer = async (uid: string, token: string | null) => {
  const response = await axios.delete(`${ENGINEERS_URL}/${uid}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response;
};

export const deleteUser = async (uid: string, token: string | null) => {
  const response = await axios.delete(`${USERS_URL}/${uid}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response;
};
