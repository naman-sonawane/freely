import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import SearchIcon from './assets/Search.svg';
import HomeIcon from './assets/Home.svg';
import DiscoverIcon from './assets/Discover.svg';
import ProfileIcon from './assets/Profile.svg';
import SaveIcon from './assets/SaveIcon.svg';

const AppNavbar: React.FC = () => {
    const location = useLocation();

    return (
        <div className="bg-white border-b border-3 border-[#DCDCDC]">
            <div className="container mx-auto px-4 py-4 flex justify-center items-center space-x-8">
                <div className="flex items-center w-60 relative">
                    <input 
                        type="text" 
                        placeholder="Search" 
                        className="pl-8 pr-3 py-2 text-sm w-full"
                        style={{
                            boxSizing: 'border-box',
                            background: '#FFFFFF',
                            border: '1px solid #000000',
                            borderRadius: '10px',
                        }} 
                    />
                    <img src={SearchIcon} alt="Search" className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4" />
                </div>
                <div className="flex space-x-6">
                    <Link to="/fyp" className="flex flex-col items-center group">
                        <img src={HomeIcon} alt="Home" className="w-6 h-6" />
                        <span className={`text-sm mt-1 ${location.pathname === '/' ? 'text-black' : 'text-gray-500'} relative group-hover:text-black`}>
                            Home
                            <span className={`absolute left-0 bottom-0 h-[1px] w-full bg-black transform ${location.pathname === '/' ? 'scale-x-100' : 'scale-x-0'} group-hover:scale-x-100 transition-transform duration-300 origin-left`}></span>
                        </span>
                    </Link>
                    <Link to="/quiz" className="flex flex-col items-center group">
                        <img src={DiscoverIcon} alt="Discover" className="w-6 h-6" />
                        <span className={`text-sm mt-1 ${location.pathname === '/discover' ? 'text-black' : 'text-gray-500'} relative group-hover:text-black`}>
                            Learn
                            <span className={`absolute left-0 bottom-0 h-[1px] w-full bg-black transform ${location.pathname === '/discover' ? 'scale-x-100' : 'scale-x-0'} group-hover:scale-x-100 transition-transform duration-300 origin-left`}></span>
                        </span>
                    </Link>
                    <Link to="/profile" className="flex flex-col items-center group">
                        <img src={ProfileIcon} alt="Profile" className="w-6 h-6" />
                        <span className={`text-sm mt-1 ${location.pathname === '/profile' ? 'text-black' : 'text-gray-500'} relative group-hover:text-black`}>
                            Profile
                            <span className={`absolute left-0 bottom-0 h-[1px] w-full bg-black transform ${location.pathname === '/profile' ? 'scale-x-100' : 'scale-x-0'} group-hover:scale-x-100 transition-transform duration-300 origin-left`}></span>
                        </span>
                    </Link>
                    <Link to="/saved" className="flex flex-col items-center group">
                        <img src={SaveIcon} alt="Profile" className="w-6 h-6" />
                        <span className={`text-sm mt-1 ${location.pathname === '/saved' ? 'text-black' : 'text-gray-500'} relative group-hover:text-black`}>
                            Saved
                            <span className={`absolute left-0 bottom-0 h-[1px] w-full bg-black transform ${location.pathname === '/saved' ? 'scale-x-100' : 'scale-x-0'} group-hover:scale-x-100 transition-transform duration-300 origin-left`}></span>
                        </span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AppNavbar;
