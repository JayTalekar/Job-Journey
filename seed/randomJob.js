import {v4 as uuid} from 'uuid';
import { categories, job_type } from '../src/constants.js';

const companies = [
    "Apple",
    "Microsoft",
    "Amazon",
    "Google",
    "Meta",
    "Tesla",
    "Samsung",
    "IBM",
    "Toyota",
    "Coca-Cola",
    "McDonald's",
    "Nike",
    "Walmart",
    "General Electric",
    "Sony",
    "Intel",
    "Adobe",
    "Netflix",
    "IBM",
    "Oracle",
    "Uber",
    "Nvidia"
]

const urls = {
    "Apple": "https://www.apple.com",
    "Microsoft": "https://www.microsoft.com",
    "Amazon": "https://www.amazon.com",
    "Google": "https://www.google.com",
    "Meta": "https://www.facebook.com",
    "Tesla": "https://www.tesla.com",
    "Samsung": "https://www.samsung.com",
    "IBM": "https://www.ibm.com",
    "Toyota": "https://www.toyota.com",
    "Coca-Cola": "https://www.coca-cola.com",
    "McDonald's": "https://www.mcdonalds.com",
    "Nike": "https://www.nike.com",
    "Walmart": "https://www.walmart.com",
    "General Electric": "https://www.ge.com",
    "Sony": "https://www.sony.com",
    "Intel": "https://www.intel.com",
    "Adobe": "https://www.adobe.com",
    "Netflix": "https://www.netflix.com",
    "Oracle": "https://www.oracle.com",
    "Uber": "https://www.uber.com",
    "Nvidia": "https://www.nvidia.com",
  }

const positions = [
    "Software Engineer",
    "Systems Analyst",
    "Network Administrator",
    "Database Administrator",
    "Web Developer",
    "DevOps Engineer",
    "Security Analyst",
    "IT Project Manager",
    "Business Analyst",
    "Data Scientist",
    "UI/UX Designer",
    "QA Engineer",
    "IT Support Specialist",
    "Cloud Architect",
    "Network Engineer",
    "Systems Administrator",
    "Front-end Developer",
    "Back-end Developer",
    "Full Stack Developer",
    "IT Manager"
]
const usa_cities = [
    "New York City",
    "Los Angeles",
    "Chicago",
    "Houston",
    "Phoenix",
    "Philadelphia",
    "San Antonio",
    "San Diego",
    "Dallas",
    "San Jose",
    "Austin",
    "Jacksonville",
    "San Francisco",
    "Columbus",
    "Indianapolis",
    "Seattle",
    "Denver",
    "Washington, D.C.",
    "Boston",
    "Nashville",
    "Baltimore",
    "Oklahoma City",
    "Portland",
    "Las Vegas",
    "Miami",
    "Atlanta",
    "New Orleans",
    "Detroit",
    "Minneapolis",
    "Salt Lake City",
    ""
]

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

function randomDate(startTime, endTime) {
    return new Date(startTime + Math.random() * (endTime - startTime)).getTime();
}

export const getJobData = (num_data) =>{
    let data = []

    if(num_data <= 0) throw "ERROR: number of data samples must be greater than zero"

    for(let i = 0; i < num_data; i++){

        const company = companies[getRandomInt(companies.length)]
        const created_category = categories[0]
        const created_on = randomDate(new Date(2023, 0, 1).getTime(), new Date().getTime())
        const updates = getUpdates(created_on)
        const curr_category = updates[updates.length-1].category

        data.push({
            id: uuid(),
            company: company,
            position: positions[getRandomInt(positions.length)],
            category: curr_category,
            salary: getRandomInt(100000),
            jobType: job_type[getRandomInt(job_type.length)],
            location: usa_cities[getRandomInt(usa_cities.length)],
            url: urls[company],
            desc: "Some Description",
            created_category: created_category,
            created_on: created_on,
            updates: updates
        })
    }

    return data
}

function getUpdates(created_on){
    let updates = []
    const num_transitions = getRandomInt(3) + 1
    
    const ts1 = randomDate(created_on, new Date().getTime())
    const ts2 = randomDate(ts1, new Date().getTime())
    const ts3 = randomDate(ts2, new Date().getTime())
    
    for(let i=0; i < num_transitions; i++){
        const t1 = ["Applied", "Interviewing", "Ghosted"]
        const t2 = ["Offer", "Rejected"]
        if(i==0){
            let index = getRandomInt(t1.length)
            updates.push({
                category: t1[index],
                timeStamp: ts1
            })
            t1.splice(index, 1)
        }
        if(i==1){
            updates.push({
                category: t1[getRandomInt(t1.length)],
                timeStamp: ts2
            })
        }
        if(i==2){
            updates.push({
                category: t2[getRandomInt(t2.length)],
                timeStamp: ts3
            })
        }
    }

    return updates
}


