import axios from "axios";
import type { User } from "../types/User";

const API_BASE = 'http://localhost:5000/api/users';

export const fetchUsers = async (): Promise<User[]> => {
  const res = await axios.get<{ success: boolean, users: User[] }>(API_BASE);
  return res.data.users; 
};


export const createUser = async (user: Partial<User>): Promise<User> => {
  const res = await axios.post<User>(API_BASE, user);
  return res.data;
};

export const updateUser = async (id: number, user: Partial<User>): Promise<User> => {
  const res = await axios.put<User>(`${API_BASE}/${id}`, user);
  return res.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE}/${id}`);
};
