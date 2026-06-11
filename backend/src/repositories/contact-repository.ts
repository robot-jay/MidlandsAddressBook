import { Contact } from '../models/contact';

export type ContactInput = Omit<Contact, 'id'>;

export interface ContactRepository {
  getAll(): Promise<Contact[]>;
  create(contact: ContactInput): Promise<Contact>;
  update(id: number, contact: ContactInput): Promise<Contact | null>;
  delete(id: number): Promise<boolean>;
}