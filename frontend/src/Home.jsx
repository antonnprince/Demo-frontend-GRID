import { Link } from "react-router-dom"


function Home(){
    return(
        <div className="bg-neutral-400 flex flex-col space-y-4 items-center justify-center h-screen">

            <button className="bg-[#2563EB] w-40 shadow-2xl rounded-lg text-2xl font-bold">
                <Link to='/packet'>
                    Packet Items
                </Link>
            </button>
            
            <button className="bg-[#2563EB] w-40 rounded-lg text-2xl font-bold">
                <Link to="/fruits">
                    Fruits
                </Link>
            </button>

            <button className="bg-[#2563EB] w-40 rounded-lg text-2xl font-bold">
                <Link to="/objects">
                    Count Objects
                </Link>
            </button>
        </div>
    )
}

export default Home