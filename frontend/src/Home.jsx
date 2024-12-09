import { Link } from "react-router-dom"


function Home(){
    return(
        <div className="bg-[#1C1917] flex flex-col space-y-4 items-center justify-center h-screen">

            <h1 className="text-5xl text-white font-extrabold ">Choose an Option    </h1>
            <button className="bg-[#2563EB] w-40 shadow-2xl rounded-lg text-2xl font-bold">
                <Link to='/packed'>
                    Packed Items
                </Link>
            </button>
            
            <button className="bg-[#2563EB] w-40 rounded-lg text-2xl font-bold">
                <Link to="/fruits">
                    Fruits
                </Link>
            </button>

            <button className="bg-[#2563EB] w-40 rounded-lg text-2xl font-bold">
                <Link to="/upload">
                    Upload File
                </Link>
            </button>
        </div>
    )
}

export default Home