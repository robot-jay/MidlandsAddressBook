import path from 'node:path';
import Database from 'better-sqlite3';

export const db = new Database('addressbook.db');

const dbPath = path.resolve('addressbook.db');

console.log(`Using SQLite database at: ${dbPath}`);

db.exec(`
  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code TEXT NOT NULL
  );
`);