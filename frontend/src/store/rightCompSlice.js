import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    messages:[],
    friend: {},
    status:false
}

const rightCompSlice = createSlice({
    name: "rightComp",
    initialState, 
    reducers:{
        handleClick: (state, action) => {
            state.status = true;
            state.messages = action.payload.messages;
            state.friend = action.payload.friend;
        }
    }
})

export const {handleClick} = rightCompSlice.actions;

export default rightCompSlice.reducer;