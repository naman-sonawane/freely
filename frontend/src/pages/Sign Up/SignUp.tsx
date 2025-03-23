import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import User from './assets/UserIcon.png';
import Email from './assets/EmailIcon.png';
import Password from './assets/LockIcon.png';
import ConfirmPassword from './assets/ConfirmIcon.png';
import Background from './assets/BG.png'; 

const SignUpPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isButtonEnabled, setIsButtonEnabled] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Enable the button if all fields are filled
        if (username && email && password && confirmPassword) {
            setIsButtonEnabled(true);
        } else {
            setIsButtonEnabled(false);
        }
    }, [username, email, password, confirmPassword]);

    const handleSignUp = async () => {
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
    
        try {
            const response = await axios.post(import.meta.env.VITE_BACKEND_URL + '/api/users/register', {
                username,
                email,
                password,
            });
    
            if (response.status === 201) {
                alert("Registration successful!");
                navigate('/profile');  // Replace with your actual route after signup
            }
        } catch (error) {
            console.error("There was an error registering the user:", error);
            alert("Error during registration. Please try again.");
        }
    };
    

    return (
        <div className="relative flex justify-center items-center h-screen w-screen">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center z-[-1]"
                style={{ backgroundImage: `url(${Background})` }}
            ></div>

            <div 
                className="border border-[#B1B1B1] p-8 rounded-xl bg-white bg-opacity-90"
                style={{
                    backgroundColor: '#FFFFFF', // Fill color
                }}
            >
                <h1 className="text-center text-2xl text-black font-semibold mb-8">Sign Up</h1>

                <div className="mb-6 relative">
                    <h2 className="text-sm text-gray-500 font-medium mb-2">Username</h2>
                    <div className="input-container flex items-center relative p-2 w-[24rem] rounded-lg text-gray-500 focus-within:text-black focus-within:border-blue-500 border-2">
                        <img src={User} alt="User Icon" className="absolute left-2" />
                        <input
                            type="text"
                            className="bg-transparent w-full placeholder-gray-500 text-sm pl-10 focus:text-black focus:placeholder-black focus:outline-none"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                </div>

                <div className="mb-6 relative">
                    <h2 className="text-sm text-gray-500 font-medium mb-2">Email Address</h2>
                    <div className="input-container flex items-center relative p-2 w-[24rem] rounded-lg text-gray-500 focus-within:text-black focus-within:border-blue-500 border-2">
                        <img src={Email} alt="Email Icon" className="absolute left-2" />
                        <input
                            type="email"
                            className="bg-transparent w-full placeholder-gray-500 text-sm pl-10 focus:text-black focus:placeholder-black focus:outline-none"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                <div className="mb-6 relative">
                    <h2 className="text-sm text-gray-500 font-medium mb-2">Password</h2>
                    <div className="input-container flex items-center relative p-2 w-[24rem] rounded-lg text-gray-500 focus-within:text-black focus-within:border-blue-500 border-2">
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

                <div className="mb-6 relative">
                    <h2 className="text-sm text-gray-500 font-medium mb-2">Confirm Password</h2>
                    <div className="input-container flex items-center relative p-2 w-[24rem] rounded-lg text-gray-500 focus-within:text-black focus-within:border-blue-500 border-2">
                        <img src={ConfirmPassword} alt="Confirm Password Icon" className="absolute left-2" />
                        <input
                            type="password"
                            className="bg-transparent w-full placeholder-gray-500 text-sm pl-10 focus:text-black focus:placeholder-black focus:outline-none"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                        onClick={isButtonEnabled ? handleSignUp : undefined}
                    >
                        Continue
                    </div>
                </div>
                <p className="text-center text-gray-400">Already have an account? <Link to="/login"><span className='text-blue-400 hover:text-blue-500 cursor-pointer'>Log In</span></Link></p>
            </div>
        </div>
    );
};

export default SignUpPage;
