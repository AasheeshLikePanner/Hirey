import RightSideComp from "../RightSideComp"
import LeftSideComp from "../LetSideComp/LeftSideComp"
import { useSelector } from "react-redux"

export default function Home(){
    const rightCompState = useSelector((state) => state.rightComp.status)

    return(
        <div>
            <div className='font-sans bg-white w-screen h-screen flex-row flex'>
                {/* left side component*/}
                <div className='w-1/3 h-full  border-r-2 border-gray-200'>
                    <LeftSideComp/>
                </div>
                {/* Right Side component */}
                <div className='w-2/3 h-full'>
                    {
                        rightCompState ?
                        <RightSideComp/>:<div className="w-full h-full justify-center items-center flex font-semibold"> <h1>Click on the <span className="text-orange-500">Person</span> To Start Chatting</h1></div>
                    }
                </div>
            </div>
        </div>
    )
}