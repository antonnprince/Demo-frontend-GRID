import { Link } from "react-router-dom"

const Nav=()=>{
    return(
        <nav className="bg-[#2563EB]" >
                <ul className="text-white flex flex-row justify-center font-bold space-x-4 md:space-x-12  p-2 md:p-4
                text-lg
                md:text-xl
                ">
                    <li>
                        <Link to="/">
                        Home
                        </Link>
                    </li>

                    <li>
                        <Link to="/packed">
                        Packed Items
                        </Link>
                    </li>

                    <li>
                        <Link to="/fruits">
                        Fruits  
                        </Link>
                    </li>

                    <li>
                        <Link to="/upload">
                        Upload File
                        </Link>
                    </li>
                </ul>
        </nav>
    )
}

export default Nav


