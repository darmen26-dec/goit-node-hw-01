const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const colors = require('colors');

const contactsPath = path.join(__dirname, './db/contacts.json');

const listContacts = async () => {
  try {
    const data = await fs.readFile(contactsPath, 'utf-8');
    const contacts = JSON.parse(data);
    return contacts || [];
  } catch (error) {
    console.log('Reading contact list error:', error.message);
    return [];
  }
};

const getContactById = async (contactId) => {
  try {
    const contacts = await listContacts();
    const contact = contacts.find((contact) => contact.id === contactId);
    return contact || null;
  } catch (error) {
    console.log('Error reading file contacts', error.message);
    return null;
  }
};

const removeContact = async (contactId) => {
  try {
    const contacts = await listContacts();
    const contactToDelete = contacts.find(
      (contact) => contact.id === contactId
    );
    if (!contactToDelete) {
      return null;
    }

    const contactsUpdate = contacts.filter(
      (contact) => contact.id !== contactId
    );
    await fs.writeFile(contactsPath, JSON.stringify(contactsUpdate, null, 2));
    return contactsUpdate;
  } catch (error) {
    console.error('Error reading file contacts', error.message);
    throw error;
  }
};

// 2 poprawiona wg zaleceń
// const removeContact = async (contactId) => {
//   try {
//     const contacts = await listContacts();
//     const contactToDelete = contacts.find(
//       (contact) => contact.id === contactId
//     );

//     if (!contactToDelete) {
//       return null;
//     }

//     const contactsUpdate = contacts.filter(
//       (contact) => contact.id !== contactId
//     );

//     await fs.writeFile(contactsPath, JSON.stringify(contactsUpdate, null, 2));

//     console.log(`Contact with id ${contactId} has been removed`);
//     return contactsUpdate;
//   } catch (error) {
//     console.error('Error reading file contacts', error.message);
//     throw error;
//   }
// };

// 1 wersja
// const removeContact = async (contactId) => {
//   try {
//     const contacts = await listContacts();
//     const contactToDelete = contacts.find(
//       (contact) => contact.id === contactId
//     );
//     const contactsUpdate = contacts.filter(
//       (contact) => contact.id !== contactId
//     );

//     await fs.writeFile(contactsPath, JSON.stringify(contactsUpdate, null, 2));
//     if (!contactToDelete) {
//       return null;
//     } else {
//       console.log(`Contact with id ${contactId} has been removed`);
//       return contactsUpdate;
//     }
//   } catch (error) {
//     console.error('Error reading file contacts', error.message);
//     return null;
//   }
// };

const addContact = async (name, email, phone) => {
  try {
    if (!name || !email || !phone) {
      console.log('Name, email, and phone are required.');
      return null;
    }

    const newContact = { id: uuidv4(), name, email, phone };
    const contacts = await listContacts();
    const updatedContacts = [...contacts, newContact];

    await fs.writeFile(contactsPath, JSON.stringify(updatedContacts, null, 2));
    console.log(`Contact "${name}" with id ${newContact.id} has been added.`);

    return newContact;
  } catch (error) {
    console.log('Error reading file contacts', error.message);
    return null;
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
