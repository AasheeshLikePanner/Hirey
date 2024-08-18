import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    typingStatus: {},
    activeStatus: {},
}

const statusSlice = createSlice({
    name: "status",
    initialState, 
    reducers:{
        setActiveStatus: (state, action) => {
            const {status, userId} = action.payload
            if (state.activeStatus[userId]) {
                state.activeStatus[userId] = status;
            }
            state.activeStatus[userId] = status
        },
        setTypingStatus: (state, action)=> {
            const {status, userId} = action.payload
            if (state.typingStatus[userId]) {
                state.typingStatus[userId] = status;
            }
            state.typingStatus[userId] = status
        }
    }
})

export const {setTypingStatus, setActiveStatus} = statusSlice.actions;

export default statusSlice.reducer;