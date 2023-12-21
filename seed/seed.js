import { initializeApp } from 'firebase/app';
import { categories } from '../src/constants.js';
import { getFirestore, collection, doc, setDoc, addDoc, getDoc, updateDoc, arrayUnion } from "firebase/firestore"; 
import { doCreateUserWithEmailAndPassword, doSignOut } from '../src/firebase/FirebaseFunctions.js';
import { getAuth } from 'firebase/auth';
import { getJobData } from './randomJob.js';
import { v4 as uuid } from 'uuid';

const firebaseConfig = {
    apiKey: "AIzaSyBfor6PrxdcdtrKdnFZAkBDTF2xAS9s_kw",
    authDomain: "job-journey-aws.firebaseapp.com",
    projectId: "job-journey-aws",
    storageBucket: "job-journey-aws.appspot.com",
    messagingSenderId: "187437998005",
    appId: "1:187437998005:web:0e7fa2979cfbe2d85a03fc",
    measurementId: "G-0KP65ZGLX3"
  };

// Initialize the Firebase App
const app = initializeApp(firebaseConfig);

// Access the Firestore database
const db = getFirestore(app);
const dashboard_coll = "dashboards"
const user_coll  = "users"
const contact_coll = "contacts"

// Create a Dummy User
async function createUser(){
    const randomInt = parseInt(Math.random()*1000)
    await doCreateUserWithEmailAndPassword(
        `jaytalekar${randomInt}@gmail.com`,
        "Test@123",
        "Jay Talekar"
    )
    console.log(`User Created with Credentials: \nemail: jaytalekar${randomInt}@gmail.com \npassword: Test@123`)
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
        return true
    }catch(e){
        console.error("Error adding document: ", e);
        return false
    }
}

export async function setupDashboard(uid){
    try{
        const docRef = doc(db, dashboard_coll, uid)
        const name = "Job Hunt " + new Date().getFullYear()
        await setDoc(docRef,
            {
                name: name,
                categories: categories,
            }
        )
        console.log("Dashboard created with ID: ", docRef.id);
        return true
    }catch(e){
        console.error("Error setting up Dashboard: ", e);
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

export async function addAllContacts(uid, contactsData){
    try{
        const contactsRef = doc(db, contact_coll, uid)
        await setDoc(contactsRef,{
            contacts: contactsData
        })

        console.log("Contacts Data added successfully.")
        return true
    }catch(e){
        console.error("Error adding contact: ", e);
        return false;
    }
}

await createUser()
const {uid, email, displayName} = getAuth().currentUser
console.log(`User created with UID: ${uid}`)

console.log("Setting User Details")
await setUserDetails(uid, displayName, email)

console.log("Setting Dasboard")
await setupDashboard(uid)

console.log("Generating Random Jobs for seeding")
const jobs = getJobData(40)
console.log("Seeding generated jobs to Firestore")
await addAllJobs(uid, jobs)

console.log("Generating Random Contacts for seeding")
const contact_1 = {
    id: uuid(),
    name: "Yousef Khalil",
    company: "Meta",
    position: "Software Developer",
    email: "ykhalil@gmail.com",
    phoneNumber: "",
    linkedIn: "",
    contactNotes: "",
    linked_jobs: []
}

const contact_2 = {
    id: uuid(),
    name: "Kelly",
    company: "Uber",
    position: "Web Developer",
    email: "kelly@outlook.com",
    phoneNumber: "",
    linkedIn: "",
    contactNotes: "",
    linked_jobs: []
}

const linked_jobs_1 = jobs.sort(() => 0.5 - Math.random()).slice(0, 10).map(j => j.id)
const linked_jobs_2 = jobs.sort(() => 0.5 - Math.random()).slice(0, 10).map(j => j.id)

contact_1.linked_jobs = linked_jobs_1
contact_2.linked_jobs = linked_jobs_2

await addAllContacts(uid, [contact_1, contact_2])

await doSignOut()
console.log("User logged out successfully")
