import { faker } from '@faker-js/faker';
import { db } from './database';
const insert = db.prepare(`
  INSERT INTO contacts (
    first_name,
    last_name,
    address,
    city,
    state,
    zip_code
  )
  VALUES (?, ?, ?, ?, ?, ?)
`);
for (let i = 0; i < 100; i++) {
    insert.run(faker.person.firstName(), faker.person.lastName(), faker.location.streetAddress(), faker.location.city(), faker.location.state({ abbreviated: true }), faker.location.zipCode());
}
console.log('Inserted 100 contacts');
const count = db.prepare('SELECT COUNT(*) AS count FROM contacts').get();
console.log(count);
