import { actions } from "./constants";

const addJob = (jobData) => ({
    type: actions.add_job,
    payload: {jobData: jobData}
})

const editJob = (jobData) => ({
    type: actions.edit_job,
    payload: {jobData: jobData}
})

const deleteJob = (id) => ({
    type: actions.delete_job,
    payload: {id: id}
})

const setBoardName = (newBoardName) => ({
    type: actions.set_board_name,
    payload: {board_name: newBoardName}
})

const persistJobs = (jobs) => ({
    type: actions.set_jobs,
    payload: {jobs: jobs}
})

const persistCategories = (categories) => ({
    type: actions.set_categories,
    payload: {categories: categories}
})

const addContact = (contactData) => ({
    type: actions.add_contact,
    payload: {contactData: contactData}
})

const editContact = (contactData) => ({
    type: actions.edit_contact,
    payload: {contactData: contactData}
})

const deleteContact = (id) => ({
    type: actions.delete_contact,
    payload: {id: id}
})

const setContacts = (contactsData) => ({
    type: actions.set_contacts,
    payload: {contactsData: contactsData}
})

const addDoc = (docData) => ({
    type: actions.add_document,
    payload: {docData: docData}
})

const editDoc = (docData) => ({
    type: actions.edit_document,
    payload: {docData: docData}
})

const deleteDoc = (id) => ({
    type: actions.delete_document,
    payload: {id: id}
})

const setDocs = (allMetadata) => ({
    type: actions.set_documents,
    payload: {allMetadata: allMetadata}
})
export {
  addJob,
  editJob,
  deleteJob,
  setBoardName,
  persistJobs,
  persistCategories,
  addContact,
  editContact,
  deleteContact,
  setContacts,
  addDoc,
  editDoc,
  deleteDoc,
  setDocs,
};