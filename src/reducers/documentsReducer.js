import { actions } from "../constants";

const initialState = []

export const documentsReducer = (state = initialState, action) => {
    const {type, payload} = action

    switch(type){
        case actions.add_document:
            return [...state, payload.docData]

        case actions.edit_document:
            const doc = payload.docData
            const updateIndex = state.findIndex(d => d.id == doc.id)
            state.splice(updateIndex, 1, doc)
            return [...state]

        case actions.delete_document:
            const deleteIndex = state.findIndex(d => d.id == payload.id)
            state.splice(deleteIndex, 1)
            return [...state]

        case actions.set_documents:
            return [...payload.allMetadata]

        default: return state
    }

}