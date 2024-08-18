import { useEffect, useState } from "react"
import AllFriendList from "../AllFriendList/AllFriendList"
import { useSelector } from "react-redux"

export default function UnReadPage({ friendlist = [], textToFind = "" }){
    const [ListOfFreinds, SetListOfFriends] = useState([])
    const userChats = useSelector((state) =>  state.chat.chats)

    useEffect(()=>{
        const f = friendlist.filter((e) => {
            console.log(e.friendId);
            
            const chats = userChats[e.friendId];
            if (chats && chats.length > 0) {
                console.log(chats[chats.length - 1]);
                
              const isRead = chats[chats.length - 1].isRead;
              console.log('friend List', isRead); 
              return !isRead; 
            }
            return false;
          });
        SetListOfFriends(f)
        console.log(f);
        
    },[])
    

    return(
        <div>
            <AllFriendList friend={ListOfFreinds} findText={textToFind} />
        </div>
    )
}