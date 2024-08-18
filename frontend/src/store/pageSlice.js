import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    allPage:true,
    unRead:false,
    readPage:false,
}

const pageSlice = createSlice({
    name: "page",
    initialState, 
    reducers:{
        openAllPage: (state, action) => {
            state.allPage = true
            state.unRead = false
            state.readPage = false

        },
        openUnReadPage: (state, action)=> {
            state.allPage = false
            state.unRead = true
            state.readPage = false
        },
        openReadPage: (state, action)=> {
            state.allPage = false
            state.unRead = false
            state.readPage = true
        }
    }
})

export const {openAllPage, openReadPage, openUnReadPage} = pageSlice.actions;

export default pageSlice.reducer;