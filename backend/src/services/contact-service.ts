import { Contact } from '../models/contact';
import { ContactInput, ContactRepository } from '../repositories/contact-repository';

export class ContactService {
  constructor(private readonly repository: ContactRepository) {}

  async getAllContacts(): Promise<Contact[]> {
    return this.repository.getAll();
  }

  async createContact(contact: ContactInput): Promise<Contact> {
    return this.repository.create(contact);
  }

  async updateContact(id: number, contact: ContactInput): Promise<Contact | null> {
    return this.repository.update(id, contact);
  }

  async deleteContact(id: number): Promise<boolean> {
    return this.repository.delete(id);
  }
}