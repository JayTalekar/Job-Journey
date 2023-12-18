import { actions } from "../constants";

const initialState = []

export const contactsReducer = (state = initialState, action) => {
    const {type, payload} = action

    switch(type){
        case actions.add_contact:
            return [...state, payload.contactData]

        case actions.edit_contact:
            const contact = payload.contactData
            const updateIndex = state.findIndex(c => c.id == contact.id)
            state.splice(updateIndex, 1, contact)
            return [...state]

        case actions.delete_contact:
            const deleteIndex = state.findIndex(c => c.id == payload.id)
            state.splice(deleteIndex, 1)
            return [...state]

        default: return state
    }

}