export class ContactService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async getAllContacts() {
        return this.repository.getAll();
    }
    async createContact(contact) {
        return this.repository.create(contact);
    }
    async updateContact(id, contact) {
        return this.repository.update(id, contact);
    }
    async deleteContact(id) {
        return this.repository.delete(id);
    }
}
