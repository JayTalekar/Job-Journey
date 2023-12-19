import { actions } from "../constants";

const initialState = []

export const jobsReducer = (state = initialState, action) => {
    const {type, payload} = action

    switch(type){
        case actions.add_job:
            return [...state, payload.jobData]

        case actions.edit_job:
            const updateIndex = state.findIndex(j => j.id == payload.id)
            state.splice(updateIndex, 1)
            return [...state, {...payload.jobData}];

        case actions.delete_job:
            const deleteIndex = state.findIndex(j => j.id == payload.id)    
            state.splice(deleteIndex, 1)
            return [...state]
            
        case actions.set_jobs:
            return payload.jobs
        
        default:
            return state
    }
}