import { useEffect, useState } from 'react';
import cat from '../../assets/cat.jpg';
import { useSelector,useDispatch } from 'react-redux';
import { handleClick } from '../../store/rightCompSlice';

export default function (data) {
  const userChats = useSelector((state) => state.chat.chats)
  const userData = useSelector((state) => state.auth.userData)
  const dispatch = useDispatch();
  const [messages, setMessages] = useState([]);
  const [allMessages, setAllMessages] = useState([]);
  const [friend, setFriend] = useState({});

  useEffect(()=>{
    let senderId = data.friendData.friendId;

    const firstChat = userChats[senderId] ? userChats[senderId][userChats[senderId].length - 1]:null;
    if (userChats[senderId]) {
      setAllMessages(userChats[senderId])
    }
    
    setMessages(firstChat)
    setFriend(data.friendData)
    
  },[data.friendData, userChats, userData])

  const handleOpenRightComp = () => {
    dispatch(handleClick({messages:allMessages, friend}))
  }
  

  return (
    <div onClick={handleOpenRightComp} className="cursor-pointer font-semibold h-28 border-t border-gray-200 p-3 flex items-center">
      <div className="w-16 flex-shrink-0 flex items-center justify-center">
        <img src={`${data.friendData.friendAvatar}`} className="rounded-full w-14 h-14 object-cover" alt="img" />
      </div>
      <div className="ml-1 flex flex-col justify-center w-full">
        <div className="flex items-center">
          <h1 className="font-medium text-lg mr-2">
            {data.friendData.friendUsername}
          </h1>
          <div
            className={`w-1 h-1 rounded-full ${
              true ? 'bg-green-500' : 'bg-gray-300'
            }`}
          ></div>
        </div>
        <div className="text-gray-500 mb-6 w-52">
          <h1 className="flex items-center">
            {messages && messages.senderUsername}:{" "}
            <span className="text-gray-700 ml-1 block overflow-hidden text-ellipsis whitespace-normal line-clamp-2">
              {messages &&
                messages.content
                }
            </span>
          </h1>
        </div>

      </div>
    </div>
  );
}
