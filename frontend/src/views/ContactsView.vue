<script setup lang="ts">
import { onMounted, ref } from 'vue';

import {
  createContact,
  deleteContact,
  getContacts,
  updateContact
} from '@/api/contactsApi';

import type {
  Contact,
  ContactInput
} from '@/models/contact';

const contacts = ref<Contact[]>([]);
const editingContactId = ref<number | null>(null);
const isLoading = ref(false);
const isSaving = ref(false);
const errorMessage = ref('');

const form = ref<ContactInput>({
  firstName: '',
  lastName: '',
  address: '',
  city: '',
  state: '',
  zipCode: ''
});

async function loadContacts() {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    contacts.value = await getContacts();
  } catch {
    errorMessage.value = 'Unable to load contacts.';
  } finally {
    isLoading.value = false;
  }
}

async function saveContact() {
  isSaving.value = true;
  errorMessage.value = '';

  try {
    if (editingContactId.value === null) {
      await createContact(form.value);
    } else {
      await updateContact(editingContactId.value, form.value);
    }

    resetForm();
    await loadContacts();
  } catch {
    errorMessage.value = 'Unable to save contact.';
  } finally {
    isSaving.value = false;
  }
}

function editContact(contact: Contact) {
  editingContactId.value = contact.id;

  form.value = {
    firstName: contact.firstName,
    lastName: contact.lastName,
    address: contact.address,
    city: contact.city,
    state: contact.state,
    zipCode: contact.zipCode
  };
}

function resetForm() {
  editingContactId.value = null;

  form.value = {
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  };
}

async function removeContact(contact: Contact) {
  const confirmed = window.confirm(
    `Delete ${contact.firstName} ${contact.lastName}?`
  );

  if (!confirmed) {
    return;
  }

  try {
    await deleteContact(contact.id);
    await loadContacts();
  } catch {
    errorMessage.value = 'Unable to delete contact.';
  }
}

onMounted(loadContacts);
</script>

<template>
  <main class="page">
    <header class="page-header">
      <div>
        <h1>Address Book</h1>
        <p>Manage contacts for the Midlands address book demo.</p>
      </div>
    </header>

    <p v-if="isLoading">Loading contacts...</p>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

    <div class="contact-form">
        <h2>{{ editingContactId === null ? 'Add Contact' : 'Edit Contact' }}</h2>

        <div class="form-grid">
            <input
            v-model="form.firstName"
            placeholder="First Name"
            />

            <input
            v-model="form.lastName"
            placeholder="Last Name"
            />

            <input
            v-model="form.address"
            placeholder="Address"
            />

            <input
            v-model="form.city"
            placeholder="City"
            />

            <input
            v-model="form.state"
            placeholder="State"
            maxlength="2"
            />

            <input
            v-model="form.zipCode"
            placeholder="Zip Code"
            />
        </div>

        <div class="form-actions">
            <button
                @click="saveContact"
                :disabled="isSaving"
            >
                {{
                isSaving
                    ? 'Saving...'
                    : editingContactId === null
                    ? 'Add Contact'
                    : 'Update Contact'
                }}
            </button>

            <button
                v-if="editingContactId !== null"
                class="secondary-button"
                @click="resetForm"
                :disabled="isSaving"
            >
                Cancel
            </button>
            </div>
        </div>

    <table v-if="!isLoading && contacts.length > 0" class="contacts-table">
      <thead>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Address</th>
          <th>City</th>
          <th>State</th>
          <th>Zip Code</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="contact in contacts" :key="contact.id">
          <td>{{ contact.firstName }}</td>
          <td>{{ contact.lastName }}</td>
          <td>{{ contact.address }}</td>
          <td>{{ contact.city }}</td>
          <td>{{ contact.state }}</td>
          <td>{{ contact.zipCode }}</td>
          <td class="actions-cell">
            <button @click="editContact(contact)">
                Edit
            </button>

            <button
                class="danger-button"
                @click="removeContact(contact)"
            >
                Delete
            </button>
            </td>
        </tr>
      </tbody>
    </table>

    <p v-if="!isLoading && contacts.length === 0">
      No contacts found.
    </p>
  </main>
</template>

<style scoped>
.page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  margin: 0;
}

.page-header p {
  margin: 0.5rem 0 0;
  color: #666;
}

.contacts-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

.contacts-table th,
.contacts-table td {
  border-bottom: 1px solid #ddd;
  padding: 0.75rem;
  text-align: left;
}

.contacts-table th {
  background: #f5f5f5;
  font-weight: 600;
}

.error {
  color: #b00020;
}

.contact-form {
  background: white;
  padding: 1rem;
  margin-bottom: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,.1);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.form-grid input {
  padding: 0.75rem;
}

.contact-form button {
  padding: 0.75rem 1.5rem;
  cursor: pointer;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
}

.secondary-button {
  background: #eee;
  color: #222;
}

.actions-cell {
  display: flex;
  gap: 0.5rem;
}

.danger-button {
  background: #b00020;
  color: white;
}
</style>