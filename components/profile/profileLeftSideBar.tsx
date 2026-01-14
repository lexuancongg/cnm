import { FaAddressBook, FaUser } from "react-icons/fa"
import {FC} from "react";
import {useRouter} from "next/navigation";

type Props = {
    menuActive: string
}

const ProfileLeftSideBar: FC<Props> = ({ menuActive }) => {
    const router = useRouter();
    return (
        <div className="w-full lg:w-64 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
            <div
                onClick={()=> {
                    router.push("/profile")
                }}
                className={`flex items-center gap-3 p-4 cursor-pointer transition-colors duration-200 ${
                menuActive === "profile" ? "bg-blue-50 border-r-2 border-blue-500" : "hover:bg-gray-50"
            }`}>
                <FaUser className="text-xl text-gray-600" />
                <span className="text-gray-800 font-medium">User Profile</span>
            </div>
            <div
                onClick={()=>{
                    router.push("/address")
                }}
                className={`flex items-center gap-3 p-4 cursor-pointer transition-colors duration-200 ${
                menuActive === "address" ? "bg-blue-50 border-r-2 border-blue-500" : "hover:bg-gray-50"
            }`}>
                <FaAddressBook className="text-xl text-gray-600" />
                <span className="text-gray-800 font-medium">Address</span>
            </div>
            {/* Add more menu items here if needed */}
        </div>
    );
};

export default ProfileLeftSideBar;