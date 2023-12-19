import { boardNameReducer } from "./boardNameReducer";
import {jobsReducer} from "./jobsReducer"
import { contactsReducer } from './contactsReducer'
import { documentsReducer } from "./documentsReducer";
import { categoriesReducer } from "./categoriesReducer"
import { combineReducers } from "@reduxjs/toolkit";

export const rootReducer = combineReducers({
    board_name: boardNameReducer,
    jobs: jobsReducer,
    categories: categoriesReducer,
    contacts: contactsReducer,
    documents: documentsReducer
})