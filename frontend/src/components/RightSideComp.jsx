import React, { useEffect } from "react";
import { useState,useRef } from "react";
import AllMessages from "./AllMessages";
import reactLogo from '../assets/react.svg'
import { LuSendHorizonal } from "react-icons/lu";
import { useForm } from "react-hook-form";
import { FaPaperclip } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { addMessage } from "../store/chatSlice";
import { useSocket } from "./Socket/SocketProvider";
import axios from "axios";

export default function RightSideComp(){
    const [typing, setTyping] = useState(false); 
    const [active, setActive] = useState(false);
    const {handleSubmit, register, setValue, reset} = useForm({defaultValues:{file:""}})
    const fileInputRef = useRef(null);
    const fetchedMessages = useSelector((state) => state.rightComp.messages)
    const fetchedFriendData = useSelector((state) => state.rightComp.friend)
    const fetchedUser = useSelector((state) => state.auth.userData)
    const socket = useSocket()
    const [friend, setFriend] = useState({})
    const [message, setMessages] = useState([])
    const [userData, setUserData] = useState({})
    const [image, setImage] = useState("")
    const [username, setUsername] = useState("")
    const [senderId, setSenderId] = useState("")
    const [loading, setLoading] = useState("");
    const dispatch = useDispatch()
    const fetchedUserStatus = useSelector((state) => state.status.activeStatus)
    const fetchedTypingStatus = useSelector((state) => state.status.typingStatus)


    useEffect(()=>{
        console.log('User online status' ,fetchedUserStatus);
        setActive(fetchedUserStatus[friend.friendId])
    },[fetchedUserStatus])

    useEffect(()=>{
        console.log(userData.id);
        
        console.log('get the typing status' , fetchedTypingStatus);
        
        setTyping(fetchedTypingStatus[friend.friendId])
    },[fetchedTypingStatus])

    useEffect(()=>{
        setUserData(fetchedUser)
        console.log(fetchedUser);
        
          startTheChatting()
    },[fetchedUser])

    function startTheChatting(){
        
    }

    useEffect(()=>{        
        setMessages(fetchedMessages)
        
    },[fetchedMessages])

    useEffect(()=>{
        setFriend(fetchedFriendData)
        setUsername(fetchedFriendData.friendUsername)
        setImage(fetchedFriendData.friendAvatar)
        setSenderId(fetchedFriendData.friendId)

    },[fetchedFriendData])

    const handleIconClick = async () => {
        fileInputRef.current.click();
        
      };
      const handleFileChange = (event) => {
        const files = event.target.files;
        if (files.length > 0) {
          setValue('file', files[0]); 
        }
      };

      
      const handleSendMessage = async (data) => {
        const formData = new FormData();
    
        const message = {
            content: data.content,
            createdAt: new Date().toISOString(),
            file: data.file,
            isRead: false,
            isFile:false,
            receiverAvatar: friend.friendAvatar,
            receiverId: friend.friendId,
            receiverUsername: friend.friendUsername, 
            senderAvatar: userData.avatar,
            senderId: userData.id,
            senderUsername: userData.username,
        }
        const userId = senderId;
        formData.append("content", data.content);
        formData.append("senderId", userData.id);  // Make sure to use userData.id here
        formData.append("receiverId", friend.friendId);  // Use friend.friendId here
    
        if (data.file) {
            
            setLoading(true)
            formData.append("file", data.file, data.file.name);
    
            try {
                const createdChat = await axios.post(`${import.meta.env.VITE_API_PREFIX}/chats/create-chat-with-file`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    withCredentials: true 
                });
                const payload = {
                    event: 'sendMessage',
                    receiverId: friend.friendId,  
                    message:createdChat.data.data[0],
                };
                fileInputRef.current.value = null;
                socket.emit('message', JSON.stringify(payload));
                dispatch(addMessage({userId: userId, message:createdChat.data.data[0]}));
            } catch (error) {
                console.error("Error sending message with file:", error);
                // Handle error (e.g., show error message to user)
            } finally {
                setLoading(false);
                reset();
            }
        } else {
            
            const payload = {
                event: 'sendMessage',
                receiverId: friend.friendId,  
                message
            };
            socket.emit('message', JSON.stringify(payload));
            dispatch(addMessage({userId: userId, message}));
            await axios.post(`${import.meta.env.VITE_API_PREFIX}/chats/create-chat`, {content:message.content,senderId:userData.id,receiverId:friend.friendId}, {withCredentials:true})
        }
    }

    const handleInputFocuse = () =>{
        console.log('On');
        
        const payload = {
            event: 'typing',
            receiverId: friend.friendId,  
            message:{userId:userData.id ,active:true},
        };
        socket.emit('message', JSON.stringify(payload))
    }

    const handleInputBlur = () =>{
        console.log('off');
        
        const payload = {
            event: 'typing',
            receiverId: friend.friendId,
            message:{userId:userData.id ,active:false},
        }
        socket.emit('message', JSON.stringify(payload))
    }

    return(
        <div  className="w-full h-screen">
            <div onClick={handleInputBlur} className='h-20 border-b-2  p-8 justify-start items-center flex bg-[#f5f5f5]' >
            <div onClick={handleInputBlur} className='flex '>
                <img  className='ml-3 w-12 h-12 rounded-full' src={image} alt="" />
                <div className='ml-4 mb-2'>
                <div className="flex justify-center items-center">
                    <h1 className='font-bold mr-1'>{username}</h1>
                    {
                        active ? <div className="mt-1 w-2 h-2 bg-green-500 rounded-full"></div>:<div className="bg-gray-400 w-2 h-2 rounded-full mt-1"/>
                    }
                </div>
                    {
                    typing ? 
                        <h2 className='text-gray-600 text-sm'>Typing....</h2>
                        :null
                    }
                </div>
            </div>
            </div>
            {/* message */}
            <div onClick={handleInputBlur} className='p-10  h-5/6 overflow-scroll'>
                    {loading ? <div>loading...</div>:null}
                <AllMessages chats={senderId}/>
            </div>

            <div  className="border-gray-200 border-t-2 min-h-0 w-full p-4  pt-3">
                <form onSubmit={handleSubmit(handleSendMessage)}>
                <div className="flex items-center bg-gray-100 rounded-md shadow-sm h-12 p-1">
                    <input
                        onFocus={handleInputFocuse}
                        onBlur={handleInputBlur}
                        {...register("content")}
                        className="outline-none w-full rounded-md text-gray-500 h-full p-4 bg-transparent"
                        placeholder="Type your message here"
                    />
                    <FaPaperclip
                    color="orange"
                    onClick={handleIconClick}
                    style={{ cursor: 'pointer' }} // Change cursor to pointer for better UX
                    />
                    <input
                    type="file"
                    {...register('file')}
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    />

                    <button type="submit"  className="bg-orange-100  w-10 h-9 flex items-center justify-center rounded-md cursor-pointer ml-2">
                        <LuSendHorizonal color="orange" className="text-lg" />
                    </button>
                </div>
                </form>
            </div>
        </div>
        )
    }