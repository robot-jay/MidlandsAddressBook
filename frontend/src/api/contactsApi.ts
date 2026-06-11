import axios from 'axios';
import type { Contact, ContactInput } from '@/models/contact';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
});

export async function getContacts(): Promise<Contact[]> {
  const response = await client.get<Contact[]>('/contacts');
  return response.data;
}

export async function createContact(contact: ContactInput): Promise<Contact> {
  const response = await client.post<Contact>('/contacts', contact);
  return response.data;
}

export async function updateContact(id: number, contact: ContactInput): Promise<Contact> {
  const response = await client.put<Contact>(`/contacts/${id}`, contact);
  return response.data;
}

export async function deleteContact(id: number): Promise<void> {
  await client.delete(`/contacts/${id}`);
}