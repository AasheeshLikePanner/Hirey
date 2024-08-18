import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AllFriendList from "../AllFriendList/AllFriendList";
import { logout } from "../../store/authSlice";
import { useNavigate } from 'react-router-dom'
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import AllPage from "../AllPage/AllPage";
import ReadPage from "../ReadPage.jsx/Read";
import UnReadPage from "../UnReadPage/UnRead";

export default function LeftSideComp() {
    const navigate = useNavigate()
    const [isAll, setIsAll] = useState(true);
    const [isRead, setIsRead] = useState(false);
    const [isBlocked, setIsBlocked] = useState(false);
    const [isUnRead, setIsUnRead] = useState(false);
    const [users, setUsers] = useState([]);
    const getFriendList = useSelector((state) => state.chat.friendList);
    const dispatch = useDispatch()
    const [friendPage, setFriendPage] = useState(false);
    const {handleSubmit, register} = useForm()
    const [searchText, setSearchText] = useState("")
    const userData = useSelector((state)=> state.auth.userData)

    useEffect(() => {
        console.log(getFriendList);
        
        setUsers(getFriendList);
    }, []);

    const handleLogOut = () =>{
        dispatch(logout())
        navigate('/')
    }

    const handleAddFriendPage = () => {
        setFriendPage(true);


    }

    const handleAddFriend = async (data) => {
        const friendUsername = await axios.post(`${import.meta.env.VITE_API_PREFIX}/users/getuser`,{username:data.username} ,{withCredentials:true});
        const res =  await axios.post(`${import.meta.env.VITE_API_PREFIX}/friends//create-friend`, {userId: userData.id ,freindId:friendUsername.data.data.id }, {withCredentials:true})
        const secondFriend =  await axios.post(`${import.meta.env.VITE_API_PREFIX}/friends//create-friend`, {userId: friendUsername.data.data.id,freindId: userData.id  }, {withCredentials:true})
        toast('Friend Added SuccessFully')
        setFriendPage(false);
        navigate('/')
    }

    return (
        <div className="w-full h-full flex flex-col">
            <div className="w-full h-26">
                <div className="p-4 border-b-2 border-gray-100 mb-2">
                    <input
                        onChange={(e) => setSearchText(e.target.value)
                        }
                        type="text"
                        className="w-full h-12 shadow-sm rounded-lg bg-gray-100 text-gray-600 outline-none p-3"
                        placeholder="Search"
                    />
                </div>
                <div className="h-1/4 flex items-center justify-center font-medium mb-2">
                    <button
                        className={`w-10 items-center h-7 rounded-full flex justify-center mr-4 ${
                            isAll ? "bg-orange-500 text-white" : "outline-gray-300 outline-2 outline text-gray-400"
                        }`}
                        onClick={() => {
                            setIsAll(true);
                            setIsRead(false);
                            setIsBlocked(false);
                            setIsUnRead(false);
                        }}
                    >
                        All
                    </button>
                    <button
                        className={`w-20 items-center h-7 rounded-full flex justify-center mr-4 ${
                            isUnRead ? "bg-orange-500 text-white" : "outline-gray-300 outline-2 outline text-gray-500"
                        }`}
                        onClick={() => {
                            setIsAll(false);
                            setIsRead(false);
                            setIsBlocked(false);
                            setIsUnRead(true);
                        }}
                    >
                        Unread
                    </button>
                    <button
                        className={`w-14 items-center h-7 rounded-full flex justify-center mr-4 ${
                            isRead ? "bg-orange-500 text-white" : "outline-gray-300 outline-2 outline text-gray-500"
                        }`}
                        onClick={() => {
                            setIsAll(false);
                            setIsRead(true);
                            setIsBlocked(false);
                            setIsUnRead(false);
                        }}
                    >
                        Read
                    </button>
                    <button
                        className={`w-20 items-center h-7 rounded-full flex justify-center mr-4 ${
                            isBlocked ? "bg-orange-500 text-white" : "outline-gray-300 outline-2 outline text-gray-500"
                        }`}
                        onClick={() => {
                            setIsAll(false);
                            setIsRead(false);
                            setIsBlocked(true);
                            setIsUnRead(false);
                        }}
                    >
                        Blocked
                    </button>
                </div>
            </div>
            {
                friendPage ? 
                <div className="w-screen items-end p-10 pb-20 flex h-screen fixed"> 
                    <div className="w-80 h-40 bg-gray-100 shadow-md rounded-lg"> 
                        <form className="flex-col w-full h-full p-5 items-center justify-center flex" onSubmit={handleSubmit(handleAddFriend)}> 
                            <input {...register('username')} className="w-full rounded-lg outline-none p-2 mb-3 text-gray-600 font-semibold" placeholder="Username" />
                            <button type="submit" className="outline-2 outline outline-gray-500 rounded-xl w-14 h-8  font-semibold text-gray-800 hover:bg-orange-500 hover:text-white hover:outline-white">Add</button>
                        </form>
                    </div>
                </div> : null
                }
            <div className="flex-grow  overflow-scroll scrollbar-hide">
                {
                    isAll && <AllPage friendlist={getFriendList} textToFind={searchText} />
                }
                {
                    isRead && <ReadPage friendlist={getFriendList} textToFind={searchText}/>
                }
                {
                    isUnRead && <UnReadPage friendlist={getFriendList} textToFind={searchText}/>
                }
                {
                    isBlocked && <div className="w-full h-full items-center justify-center flex font-bold font-mono"><h1>Blocking friend is bad <span className=" text-6xl">😾</span></h1></div>
                }
            </div>
            <div className=" h-20 border-t-2 border-gray-100 items-center justify-center flex font-semibold text-gray-600">
                <button onClick={handleLogOut} className=" w-18 rounded-2xl p-2 items-center justify-center h-10 outline outline-2 outline-gray-300 hover:bg-orange-500 hover:text-white">Logout</button>
                <button onClick={handleAddFriendPage} className="ml-5 w-18 rounded-2xl p-2 items-center justify-center h-10 outline-2 outline outline-gray-300 hover:bg-orange-500 hover:text-white">Add Friend</button>
            </div>
        </div>
    );
}
