import AllFriendList from "../AllFriendList/AllFriendList"

export default function AllPage({ friendlist = [], textToFind = "" }){

    return(
        <div>
            <AllFriendList friend={friendlist} findText={textToFind} />
        </div>
    )
}