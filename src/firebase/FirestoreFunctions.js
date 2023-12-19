import { collection, doc, setDoc, addDoc, getDoc, updateDoc, arrayUnion } from "firebase/firestore"; 
import { categories } from "../constants";
import { db } from "../main";

const dashboard_coll = "dashboards"
const user_coll  = "users"
const contact_coll = "contacts"

export async function setupDashboard(uid){
    try{
        const docRef = doc(db, dashboard_coll, uid)
        const name = "Job Hunt " + new Date().getFullYear()
        await setDoc(docRef,
            {
                name: name,
                categories: categories,
                jobs: []
            }
        )
        console.log("Dashboard created with ID: ", docRef.id);
        return true
    }catch(e){
        console.error("Error setting up Dashboard: ", e);
        return false
    }
}

export async function setUserDetails(uid, name, email){
    try{
        const docRef = doc(db, user_coll, uid)
        await setDoc(docRef,
            {
                name: name,
                email: email
            }
        )
        console.log("Document written with ID: ", docRef.id);
        return true
    }catch(e){
        console.error("Error adding document: ", e);
        return false
    }
}

export async function addAllJobs(uid, jobs){
    try{
        const dashboardRef = doc(db, dashboard_coll, uid)
        await updateDoc(dashboardRef, {
            "jobs": jobs
        })

        console.log("All Jobs added");
        return true
    }catch(e){
        console.error("Error add all Jobs", e);
        return false
    }
}


export async function addJob(uid, jobData){
    const dashboardRef = doc(db, dashboard_coll, uid)
    await updateDoc(dashboardRef, {
        "jobs": arrayUnion(jobData)
    })

    console.log("Job added with ID: ", jobData.id);
}

export async function updateJob(uid, jobData){
    const dashboardRef = doc(db, dashboard_coll, uid)
    const dashboardSS = await getDoc(dashboardRef)

    const jobs = dashboardSS.data().jobs

    const jobIndex = jobs.findIndex(job => job.id === jobData.id)

    if(jobIndex == -1) throw new Error("No Job to update with id: " + jobData.id)

    jobs.splice(jobIndex, 1, jobData)

    await updateDoc(dashboardRef, {
        "jobs": jobs
    })
    
    console.log("Job updated with ID: ", jobData.id);

}

export async function deleteJob(uid, jobId){
    const dashboardRef = doc(db, dashboard_coll, uid)
    const dashboardSS = await getDoc(dashboardRef)

    const jobs = dashboardSS.data().jobs

    const jobIndex = jobs.findIndex(job => job.id === jobId)

    if(jobIndex == -1) throw new Error("No Job found with ID: " + jobId)

    jobs.splice(jobIndex, 1)

    await updateDoc(dashboardRef, {
        "jobs": jobs
    })
    
    console.log("Job Deleted with ID: ", jobId);
}

export async function getDashboardData(uid){
    try{
        const dashboardRef = doc(db, dashboard_coll, uid)
        const dashboardSS = await getDoc(dashboardRef)

        return dashboardSS.data()
    }catch(e){
        console.error("Error fetching Dashboard Data: ", e);
        return false
    }
}

export async function updateCategoryPosition(uid, array, index1, index2) {
    try {
        const dashboardRef = doc(db, dashboard_coll, uid);
        array.splice(index2, 1, array.splice(index1, 1, array[index2])[0])
        await updateDoc(dashboardRef, {
            categories: array
        });

        console.log("Category positions updated successfully.");
        return true;
    } catch (e) {
        console.error("Error updating category positions: ", e);
        return false;
    }
}

export async function getContacts(uid){
    try{
        const contactsRef = doc(db, contact_coll, uid)
        const contactsSS = await getDoc(contactsRef)

        return contactsSS.data().contacts
    }catch(e){
        console.error("Error fetching contacts: ", e);
        return false;
    }
}

export async function addContact(uid, contactData){
    try{
        const contactRef = doc(db, contact_coll, uid)
        await setDoc(contactRef,{
            contacts: arrayUnion(contactData)
        })

        console.log("Contact Data added successfully.")
        return true
    }catch(e){
        console.error("Error adding contact: ", e);
        return false;
    }
}

export async function editContact(uid, contactData){
    try{
        const contactRef = doc(db, contact_coll, uid)
        const contactSS = await getDoc(contactRef)

        const contacts = contactSS.data().contacts
        const index = contacts.findIndex(c => c.id == contactData.id)

        contacts.splice(index, 1, contactData)

        await setDoc(contactRef,{
            contacts: contacts
        })

        console.log("Contact Data edited successfully.")
        return true
    }catch(e){
        console.error("Error editing contact: ", e);
        return false;
    }
}

export async function deleteContact(uid, id){
    try{
        const contactRef = doc(db, contact_coll, uid)
        const contactSS = await getDoc(contactRef)

        const contacts = contactSS.data().contacts
        const index = contacts.findIndex(c => c.id == id)

        contacts.splice(index, 1)

        await setDoc(contactRef,{
            contacts: contacts
        })

        console.log("Contact Data deleted successfully.")
        return true
    }catch(e){
        console.error("Error deleting contact: ", e);
        return false;
    }
}