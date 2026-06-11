import { Database } from 'better-sqlite3';
import { Contact } from '../models/contact';
import { ContactInput, ContactRepository } from './contact-repository';

export class SqliteContactRepository implements ContactRepository {
  constructor(private readonly db: Database) {}

  getAll(): Promise<Contact[]> {
    const rows = this.db.prepare(`
      SELECT
        id,
        first_name AS firstName,
        last_name AS lastName,
        address,
        city,
        state,
        zip_code AS zipCode
      FROM contacts
      ORDER BY last_name, first_name
    `).all();

    return Promise.resolve(rows as Contact[]);
  }

  create(contact: ContactInput): Promise<Contact> {
    const result = this.db.prepare(`
      INSERT INTO contacts (
        first_name,
        last_name,
        address,
        city,
        state,
        zip_code
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      contact.firstName,
      contact.lastName,
      contact.address,
      contact.city,
      contact.state,
      contact.zipCode
    );

    return Promise.resolve({
      id: Number(result.lastInsertRowid),
      ...contact
    });
  }

  update(id: number, contact: ContactInput): Promise<Contact | null> {
    const result = this.db.prepare(`
      UPDATE contacts
      SET
        first_name = ?,
        last_name = ?,
        address = ?,
        city = ?,
        state = ?,
        zip_code = ?
      WHERE id = ?
    `).run(
      contact.firstName,
      contact.lastName,
      contact.address,
      contact.city,
      contact.state,
      contact.zipCode,
      id
    );

    if (result.changes === 0) {
      return Promise.resolve(null);
    }

    return Promise.resolve({
      id,
      ...contact
    });
  }

  delete(id: number): Promise<boolean> {
    const result = this.db.prepare(`
      DELETE FROM contacts
      WHERE id = ?
    `).run(id);

    return Promise.resolve(result.changes > 0);
  }
}