import {configureStore} from '@reduxjs/toolkit'
import authSlice from './authSlice'
import chatSlice from './chatSlice';
import rightCompSlice from './rightCompSlice';
import statusSlice from './statusSlice'
import pageSlice from './pageSlice';

const store = configureStore({
    reducer:{
        auth:authSlice,
        chat:chatSlice,
        rightComp:rightCompSlice,
        status:statusSlice,
    }
})

export default store;