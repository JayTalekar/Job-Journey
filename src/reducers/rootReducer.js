import { boardNameReducer } from "./boardNameReducer";
import {jobsReducer} from "./jobsReducer"
import { contactsReducer } from './contactsReducer'
import { documentsReducer } from "./documentsReducer";
import { categoriesReducer } from "./categoriesReducer"
import { combineReducers } from "@reduxjs/toolkit";

const combinedReducers = combineReducers({
    board_name: boardNameReducer,
    jobs: jobsReducer,
    categories: categoriesReducer,
    contacts: contactsReducer,
    documents: documentsReducer
})

export const rootReducer = (state, action) => {
    if(action.type === 'RESET_STATE') state = undefined
    return combinedReducers(state, action)
}