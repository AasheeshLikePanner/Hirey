import React, { useEffect, useState } from "react";
import Message from "./message";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { removeLastMessageAndUpdate } from "../store/chatSlice";

export default function AllMessages({ chats }) {
  const userData = useSelector((state) => state.auth.userData);
  const fetchMessage = useSelector((state) => state.chat.chats);
  const [displayedChats, setDisplayedChats] = useState([]);
  const dispatch = useDispatch()
  useEffect(() => {
    setDisplayedChats(fetchMessage[chats] || []); // Set fetched messages based on chats prop
  }, [fetchMessage, chats]);

  useEffect(()=>{
    console.log('chats update');
    
    async function settingTheMessageToRead(){
      dispatch(removeLastMessageAndUpdate(chats))
      const chatId = fetchMessage[chats][fetchMessage[chats].length - 1].chatId;
      const r = await axios.post(`${import.meta.env.VITE_API_PREFIX}/chats/set-chat-read` , {chatId},{withCredentials:true})
      console.log(r);
    }
  settingTheMessageToRead()
  },[chats])

  function timeAgo(dateString) {
    const now = new Date();
    const pastDate = new Date(dateString);
    const diffInMs = now - pastDate;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    } else {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
    }
  }

  return (
    <div className="font-sans">
      {displayedChats &&
        displayedChats.map((e, i) => {
          const isLastMessage = i === displayedChats.length - 1;
          const messageTime = timeAgo(e.createdAt);
          const isUserMessage = e.senderId === userData.id;
          
          return (
            <div
              className={`mb-5 w-full ${
                isUserMessage ? "flex justify-end" : "flex justify-start"
              }`}
              key={e.id || i}
            >
              <div className={`flex flex-col items-${isUserMessage ? "end" : "start"}`}>
                <Message
                  classStyle={
                    isUserMessage
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-700"
                  }
                  content={{content:e}}
                />
                {isLastMessage && (
                  <h1 className="text-xs text-gray-400 mt-1">{messageTime}</h1>
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
}
