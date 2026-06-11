import { describe, expect, it } from 'vitest';

import { ContactService } from './contact-service';
import type { ContactRepository } from '../repositories/contact-repository';

describe('ContactService', () => {
  it('returns contacts from the repository', async () => {
    const repository: ContactRepository = {
      getAll: async () => [
        {
          id: 1,
          firstName: 'Ada',
          lastName: 'Lovelace',
          address: '123 Code St',
          city: 'Lincoln',
          state: 'NE',
          zipCode: '68508'
        }
      ],
      create: async contact => ({ id: 2, ...contact }),
      update: async (id, contact) => ({ id, ...contact }),
      delete: async () => true
    };

    const service = new ContactService(repository);

    const contacts = await service.getAllContacts();

    expect(contacts).toHaveLength(1);
    expect(contacts[0].firstName).toBe('Ada');
  });

  it('creates a contact through the repository', async () => {
    const repository: ContactRepository = {
      getAll: async () => [],
      create: async contact => ({ id: 1, ...contact }),
      update: async () => null,
      delete: async () => false
    };

    const service = new ContactService(repository);

    const contact = await service.createContact({
      firstName: 'Grace',
      lastName: 'Hopper',
      address: '456 Compiler Ave',
      city: 'Omaha',
      state: 'NE',
      zipCode: '68104'
    });

    expect(contact.id).toBe(1);
    expect(contact.lastName).toBe('Hopper');
  });

  it('returns null when updating a missing contact', async () => {
    const repository: ContactRepository = {
      getAll: async () => [],
      create: async contact => ({ id: 1, ...contact }),
      update: async () => null,
      delete: async () => false
    };

    const service = new ContactService(repository);

    const contact = await service.updateContact(999, {
      firstName: 'Missing',
      lastName: 'Person',
      address: 'Nowhere',
      city: 'Lincoln',
      state: 'NE',
      zipCode: '68508'
    });

    expect(contact).toBeNull();
  });
});