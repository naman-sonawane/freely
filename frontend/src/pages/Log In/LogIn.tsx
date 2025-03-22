import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import User from './assets/UserIcon.png';
import Password from './assets/LockIcon.png';
import Background from './assets/BG.png'; 

const LoginPage: React.FC = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [isButtonEnabled, setIsButtonEnabled] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (identifier && password) {
            setIsButtonEnabled(true);
        } else {
            setIsButtonEnabled(false);
        }
    }, [identifier, password]);

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/users/login', {
                identifier,
                password,
            });

            if (response.status === 200) {
                alert("Login successful!");
                Cookies.set('username', response.data.user.username, { expires: 30 });
                navigate('/profile');  // Redirect to /profile after successful login
            }
        } catch (error) {
            console.error("There was an error logging in the user:", error);
            alert("Error during login. Please try again.");
        }
    };

    return (
        <div className="relative flex justify-center items-center h-screen w-screen">
            <div
                className="absolute inset-0 bg-cover bg-center z-[-1]"
                style={{ backgroundImage: `url(${Background})` }}
            ></div>

            <div 
                className="border border-[#B1B1B1] p-8 rounded-xl bg-white bg-opacity-90"
                style={{
                    backgroundColor: '#FFFFFF',
                }}
            >
                <h1 className="text-center text-2xl text-black font-semibold mb-8">Sign In</h1>

                <div className="mb-6 relative">
                    <h2 className="text-sm text-gray-500 font-medium mb-2">Username or Email</h2>
                    <div className="input-container flex items-center relative p-2 w-[24rem] rounded-lg text-gray-500 focus-within:text-black focus-within:border-blue-500"
                        style={{
                            background: '#DDDDDD',
                            border: '0.5px solid #5F5F5F',
                            boxShadow: 'inset 0px 2px 3.8px rgba(0, 0, 0, 0.5)',
                            borderRadius: '10px',
                        }}
                    >
                        <img src={User} alt="User Icon" className="absolute left-2" />
                        <input
                            type="text"
                            className="bg-transparent w-full placeholder-gray-500 text-sm pl-10 focus:text-black focus:placeholder-black focus:outline-none"
                            placeholder="Enter your username or email"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                        />
                    </div>
                </div>

                <div className="mb-6 relative">
                    <h2 className="text-sm text-gray-500 font-medium mb-2">Password</h2>
                    <div className="input-container flex items-center relative p-2 w-[24rem] rounded-lg text-gray-500 focus-within:text-black focus-within:border-blue-500"
                        style={{
                            background: '#DDDDDD',
                            border: '0.5px solid #5F5F5F',
                            boxShadow: 'inset 0px 2px 3.8px rgba(0, 0, 0, 0.5)',
                            borderRadius: '10px',
                        }}
                    >
                        <img src={Password} alt="Password Icon" className="absolute left-2" />
                        <input
                            type="password"
                            className="bg-transparent w-full placeholder-gray-500 text-sm pl-10 focus:text-black focus:placeholder-black focus:outline-none"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex justify-center mb-6">
                    <div
                        className={`text-white cursor-pointer text-center w-40 py-2 px-4 rounded-xl ${
                            isButtonEnabled
                                ? 'bg-green-600 hover:bg-green-700'
                                : 'bg-[#b1b1b1] hover:bg-[#b1b1b1]'
                        } transition-colors`}
                        onClick={isButtonEnabled ? handleLogin : undefined}
                    >
                        Continue
                    </div>
                </div>
                <p className="text-center text-gray-400">Don't have an account? <Link to="/signup"><span className='text-blue-400 hover:text-blue-500 cursor-pointer'>Sign Up</span></Link></p>
            </div>
        </div>
    );
};

export default LoginPage;
