export{
    actions,
    categories,
    job_type
}

const actions = {
    set_jobs: "SET_JOBS",
    set_categories: "SET_CATEGORIES",
    add_job: 'ADD_JOB',
    done_add_job: 'DONE_ADD_JOB',
    edit_job: 'EDIT_JOB',
    delete_job: 'DELETE_JOB',
    done_edit_job: 'DONE_EDIT_JOB',
    set_board_name: 'SET_BOARD_NAME',
    add_contact: 'ADD_CONTACT',
    edit_contact: 'EDIT_CONTACT',
    delete_contact: 'DELETE_CONTACT'
}

const categories = [
    "Wishlist",
    "Applied",
    "Interviewing",
    "Offer",
    "Rejected",
    "Ghosted"
]

const job_type = [
    "Remote",
    "Hybrid",
    "Onsite"
]