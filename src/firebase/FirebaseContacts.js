import { collection, doc, setDoc, addDoc, getDoc, updateDoc, deleteDoc } from "firebase/firestore"; 
import { db } from "../main"; 

const contactsCollection = "contacts";

export async function addContact(contactData) {
    try {
        const docRef = await addDoc(collection(db, contactsCollection), contactData);
        console.log("Contact added with ID: ", docRef.id);
        return true;
    } catch (e) {
        console.error("Error adding contact: ", e);
        return false;
    }
}

export async function updateContact(contactId, contactData) {
    try {
        const docRef = doc(db, contactsCollection, contactId);
        await updateDoc(docRef, contactData);
        console.log("Contact updated with ID: ", contactId);
        return true;
    } catch (e) {
        console.error("Error updating contact: ", e);
        return false;
    }
}

export async function getContact(contactId) {
    try {
        const docRef = doc(db, contactsCollection, contactId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log("Contact data:", docSnap.data());
            return docSnap.data();
        } else {
            console.log("No such contact!");
            return null;
        }
    } catch (e) {
        console.error("Error fetching contact: ", e);
        return false;
    }
}

export async function deleteContact(contactId) {
    try {
        await deleteDoc(doc(db, contactsCollection, contactId));
        console.log("Contact deleted with ID: ", contactId);
        return true;
    } catch (e) {
        console.error("Error deleting contact: ", e);
        return false;
    }
}
