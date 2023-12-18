export function validateName(name) {
    if(name.length < 3) throw new Error("Name must be atleast 3 characters long!")
    if(name.length > 25) throw new Error("Name can be atmost 25 characters long!")
    // Regular expression pattern for name validation
    const namePattern = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;

    // Check if the name matches the pattern
    if (!namePattern.test(name)) {
        throw new Error("Invalid name format. Please provide a valid name!");
    }

    return true;
}


export function validateEmail(email) {
    // Regular expression pattern for email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Check if the email matches the pattern
    if (!emailPattern.test(email)) {
        throw new Error("Invalid email format. Please provide a valid email address.");
    }

    return true;
}

export function validatePassword(password) {
    const capitalLetterPattern = /[A-Z]/;
    const lowerCaseLetterPattern = /[a-z]/
    const numeralPattern = /\d/;
    const specialCharacterPattern = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    
    if(password.length < 8)
        throw new Error("Password must have 8 characters minimum")
    else if(!capitalLetterPattern.test(password))
        throw new Error("Password must contain atleast one Capital case character")
    else if(!lowerCaseLetterPattern.test(password))
        throw new Error("Password must contain atleast one Lower case character")
    else if(!numeralPattern.test(password))
        throw new Error("Password must contain atleast one number")
    else if(!specialCharacterPattern.test(password))
        throw new Error("Password must contain atleast one Special character")

    return true;
}

export function validateCompanyName(companyName) {
    if (companyName.length < 3) {
        throw new Error("Company name must be at least 3 characters long!");
    }
    if (companyName.length > 30) {
        throw new Error("Company name can be at most 30 characters long!");
    }

    // Regular expression pattern for company name validation
    const companyNamePattern = /^[a-zA-Z0-9\s]+$/;

    // Check if the company name matches the pattern
    if (!companyNamePattern.test(companyName)) {
        throw new Error("Invalid company name format. Please provide a valid company name!");
    }

    return true;
}

export function validateJobPositionTitle(title) {
    if (title.length < 3) {
        throw new Error("Job position title must be at least 3 characters long!");
    }
    if (title.length > 30) {
        throw new Error("Job position title can be at most 30 characters long!");
    }

    // Regular expression pattern for job position title validation
    const titlePattern = /^[a-zA-Z0-9\s]+$/;

    // Check if the job position title matches the pattern
    if (!titlePattern.test(title)) {
        throw new Error("Invalid job position title format. Please provide a valid title!");
    }

    return true;
}

export function validateSalary(salary) {
    if (typeof salary !== 'number') {
        throw new Error("Salary must be a number!");
    }

    if (salary < 0) {
        throw new Error("Salary cannot be negative!");
    }

    return true;
}

export function validateLocationName(locationName) {
    if (locationName.length < 3) {
        throw new Error("Location name must be at least 3 characters long!");
    }
    if (locationName.length > 30) {
        throw new Error("Location name can be at most 30 characters long!");
    }

    // Regular expression pattern for location name validation
    const locationNamePattern = /^[a-zA-Z0-9\s]+$/;

    // Check if the location name matches the pattern
    if (!locationNamePattern.test(locationName)) {
        throw new Error("Invalid location name format. Please provide a valid location name!");
    }

    return true;
}

export function validateURL(url) {
    // Regular expression pattern for URL validation
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

    // Check if the URL matches the pattern
    if (!urlPattern.test(url)) {
        throw new Error("Invalid URL format. Please provide a valid URL!");
    }

    return true;
}

export function validateDescription(description) {
    if (typeof description !== 'string') {
        throw new Error("Description must be a string!");
    }

    if (description.length < 10) {
        throw new Error("Description must be at least 10 characters long!");
    }

    if (description.length > 500) {
        throw new Error("Description can be at most 500 characters long!");
    }

    return true;
}

export function validatePhoneNumber(phoneNumber) {
    // Regular expression pattern for phone number validation
    const phoneNumberPattern = /^\d{10}$/;

    // Check if the phone number matches the pattern
    if (!phoneNumberPattern.test(phoneNumber)) {
        throw new Error("Invalid phone number format. Please provide a valid phone number!");
    }

    return true;
}
