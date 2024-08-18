import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { AllMessages, Message, RightSideComp,Home, LoginPage } from './components'
import { useDispatch } from 'react-redux'
import { login } from './store/authSlice'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { addChatTofriend, addFriend, addMessage, addFriendList } from './store/chatSlice'
import io from 'socket.io-client';
import { setActiveStatus, setTypingStatus } from './store/statusSlice'
import { useSocket } from './components/Socket/SocketProvider'

function App() {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const socket = useSocket();
  
  useEffect(()=>{
    async function autoLogin(){
      const res = await axios.get(`${import.meta.env.VITE_API_PREFIX}/users/current-user`,{withCredentials:'include'})
      if (!res) return;
      dispatch(login( res.data.data))

      const friendList = await axios.post(`${import.meta.env.VITE_API_PREFIX}/friends/friend-list`, {userId:res.data.data.id},{withCredentials:true})
      dispatch(addFriendList(friendList.data.data))
      friendList.data.data.forEach((e) => {
       
        async function getChat(){
            let senderId = e.friendId;
            
            const useChats = await axios.post(`${import.meta.env.VITE_API_PREFIX}/chats/get-chat`,{senderId, receiverId:res.data.data.id},{withCredentials:true});
            
            dispatch(addChatTofriend({userId:senderId, message:useChats.data.data}))
        }
        getChat();

      })      

      navigate('/home')
    }
    autoLogin()
  },[])


useEffect(()=>{
    console.log('your socket is:',socket);
    if (!socket) {
      return;
    }
    
    socket.on('receiveMessage', (data) => {
      const message = JSON.parse(data)
      console.log('data', message);
      
      console.log("message",message.message.senderId);
      console.log("receiver Id",message.message.senderId);
      
      dispatch(addMessage({userId:message.message.senderId,message:message.message}))
    })
    socket.on('userTyping', (data) => {
      const message = JSON.parse(data)
      console.log(message);
      
      dispatch(setTypingStatus({userId:message.message.userId, status:message.message.active}))
    })
    socket.on('setUserStatus', (data) => {
      const message = JSON.parse(data);
      console.log(data);
      
      dispatch(setActiveStatus({userId: message.userid, status:message.status}))      
    })
    // socket.on('setUserStatus', (data) => {
    //   const message = JSON.parse(data.message)
    //   dispatch(setActiveStatus({userId:message.id, status: message.status}))
      
    // })
},[socket])

  return (
    <div className='font-sans bg-white w-screen h-screen flex-row flex'>
      <LoginPage/>
    </div>
  )
}

export default App
