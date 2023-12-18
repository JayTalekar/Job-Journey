import { addJobReducer } from "./addJobReducer";
import { editJobReducer } from "./editJobReducer";
import { boardNameReducer } from "./boardNameReducer";
import {jobsReducer} from "./jobsReducer"
import { contactsReducer } from './contactsReducer'
import { categoriesReducer } from "./categoriesReducer"
import { combineReducers } from "@reduxjs/toolkit";

export const rootReducer = combineReducers({
    new_job: addJobReducer,
    edited_job: editJobReducer,
    board_name: boardNameReducer,
    jobs: jobsReducer,
    categories: categoriesReducer,
    contacts: contactsReducer
})