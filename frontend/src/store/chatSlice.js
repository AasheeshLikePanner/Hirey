import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    friendList: {},
    chats:{}
}
const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        addFriend: (state, action) => {
            const { userId, friend } = action.payload;
            if (!state.friendList[userId]) {
                state.friendList[userId] = []; // Initialize an empty array if the user ID doesn't exist
            }
            state.friendList[userId].push(friend);

        },
        addMessage: (state, action) => {
            const { userId, message } = action.payload;
            if (!state.chats[userId]) {
                state.chats[userId] = []; // Initialize an empty array if the user ID doesn't exist
            }
            state.chats[userId].push(message);
            console.log(userId, message);
        },
        addFriendList:(state, action)=>{
            state.friendList = action.payload
        },
        addChatTofriend:(state, action) => {
            const {userId, message} = action.payload;
            state.chats[userId] = message;
        },
        removeLastMessageAndUpdate: (state, action) => {
            const { userId } = action.payload;
        
            if (state.chats[userId] && state.chats[userId].length > 0) {
                const lastMessage = state.chats[userId][state.chats[userId].length - 1];
                
                const updatedLastMessage = { ...lastMessage, isRead: true };
        
                state.chats[userId] = state.chats[userId].slice(0, -1);
        
                state.chats[userId].push(updatedLastMessage);
        
                console.log('Updated chats:', state.chats[userId]);
            }
        },
        
    },
});

export const { addFriend, addMessage, addFriendList, addChatTofriend, removeLastMessageAndUpdate } = chatSlice.actions;
export default chatSlice.reducer;