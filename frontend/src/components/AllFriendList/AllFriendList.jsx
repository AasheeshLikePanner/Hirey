import { useEffect } from "react";
import FriendComp from "../FriendComp/FriendComp";

export default function AllFriendList({ friend = [], findText="" }) { // Default to empty array if `friend` is not provided
    useEffect(() => {
        console.log(friend);
    }, [friend]);

    return (
        <div>
            {(Array.isArray(friend) ? friend : [])
            .filter((e) => e.friendUsername.toLowerCase().includes(findText.toLowerCase())) // Assuming `e.name` is the property you want to filter by
            .map((e) => (
                <FriendComp
                key={e.friendId} // Ensure this is a unique key
                friendData={e}
                />
            ))}

        </div>
    );
}
