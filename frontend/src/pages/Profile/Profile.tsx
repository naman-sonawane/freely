import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie'; 
import PlusIcon from './assets/Plus.svg';
import CloseIcon from './assets/Close.svg';
import AppNavbar from '../App Navbar/AppNavbar'; 
import { Navigate } from 'react-router-dom';

const Profile: React.FC = () => {
    const [academicInterests, setAcademicInterests] = useState<string[]>([]);
    const [goalsProjects, setGoalsProjects] = useState<string[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [newItem, setNewItem] = useState('');
    const [isButtonEnabled, setIsButtonEnabled] = useState(false);

    useEffect(() => {
        const fetchProfileData = async () => {
            const username = Cookies.get('username');

            if (!username) {
                console.error('Username not found in cookies');
                return;
            }

            try {
                const response = await axios.get('/api/users/profile', {
                    params: { username }
                });
                const { interests, goals } = response.data;
                setAcademicInterests(interests);
                setGoalsProjects(goals);
            } catch (error) {
                console.error('Error fetching profile data:', error);
            }
        };

        fetchProfileData();
    }, []);

    const openModal = (title: string) => {
        setModalTitle(title);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setNewItem('');
        setIsButtonEnabled(false);
    };

    const handleInputChange = (value: string) => {
        setNewItem(value);
        setIsButtonEnabled(value.trim() !== '');
    };

    const handleAddItem = async () => {
        if (newItem.trim()) {
            if (modalTitle === 'Add Interest') {
                setAcademicInterests([...academicInterests, newItem]);
                await updateUserProfile([...academicInterests, newItem], goalsProjects);
            } else if (modalTitle === 'Add Project') {
                setGoalsProjects([...goalsProjects, newItem]);
                await updateUserProfile(academicInterests, [...goalsProjects, newItem]);
            }
            closeModal();
        }
    };

    const handleDeleteItem = async (index: number, type: string) => {
        if (type === 'interest') {
            const updatedInterests = academicInterests.filter((_, i) => i !== index);
            setAcademicInterests(updatedInterests);
            await updateUserProfile(updatedInterests, goalsProjects);
        } else if (type === 'project') {
            const updatedGoals = goalsProjects.filter((_, i) => i !== index);
            setGoalsProjects(updatedGoals);
            await updateUserProfile(academicInterests, updatedGoals);
        }
    };

    const updateUserProfile = async (interests: string[], goals: string[]) => {
        const username = Cookies.get('username');

        if (!username) {
            console.error('Username not found in cookies');
            return;
        }

        try {
            const response = await axios.put('/api/users/profile', {
                username,
                interests,
                goals
            });
            console.log(response.data.message);
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    if (!Cookies.get("username")) {
        return <Navigate to="/login" />;
    }

    return (
        <div className='relative min-h-screen overflow-x-hidden'>
            <div className='w-full z-10'>
                <AppNavbar />
            </div>

            <div className="flex flex-col md:flex-row items-start justify-around min-h-screen p-6 w-full space-y-6 md:space-y-0 md:space-x-6"> 
                <div className="p-4 bg-white rounded-lg shadow-sm w-full md:w-5/12 flex flex-col"> 
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg md:text-xl font-semibold text-[#00695C]">Academic Interests</h2>
                        <div
                            className="text-white cursor-pointer transform transition-transform duration-200 hover:scale-110"
                            onClick={() => openModal('Add Interest')}
                        >
                            <img src={PlusIcon} alt="Add" className="w-6 h-6" />
                        </div>
                    </div>
                    <p className="text-gray-500 mb-4">Add some interests for our algorithm to better personalize your feed.</p>
                    <div className="flex flex-col gap-2 overflow-y-auto pr-4" style={{ flexGrow: 1 }}> {/* Stacked items vertically with scroll */}
                        {academicInterests.map((interest, index) => (
                            <div key={index} className="flex justify-between items-center px-4 py-2 bg-gray-100 rounded-lg border border-gray-300">
                                <span className="inline-block">{interest}</span>
                                <img
                                    src={CloseIcon}
                                    alt="Delete"
                                    className="w-4 h-4 cursor-pointer"
                                    onClick={() => handleDeleteItem(index, 'interest')}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-4 bg-white rounded-lg shadow-sm w-full md:w-5/12 flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg md:text-xl font-semibold text-[#00695C]">Goals/Projects</h2>
                        <div
                            className="text-white cursor-pointer transform transition-transform duration-200 hover:scale-110"
                            onClick={() => openModal('Add Project')}
                        >
                            <img src={PlusIcon} alt="Add" className="w-6 h-6" />
                        </div>
                    </div>
                    <p className="text-gray-500 mb-4">
                        Set your goals and ongoing projects here. This will help our algorithm understand your aspirations and see what you’re working on, making it easier to support your journey.
                    </p>
                    <div className="flex flex-col gap-2 overflow-y-auto pr-4" style={{ flexGrow: 1 }}> {/* Stacked items vertically with scroll */}
                        {goalsProjects.map((project, index) => (
                            <div key={index} className="flex justify-between items-center px-4 py-2 bg-gray-100 rounded-lg border border-gray-300">
                                <span className="inline-block">{project}</span>
                                <img
                                    src={CloseIcon}
                                    alt="Delete"
                                    className="w-4 h-4 cursor-pointer"
                                    onClick={() => handleDeleteItem(index, 'project')}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-lg w-96 relative p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h1 className="text-xl font-semibold">{modalTitle}</h1>
                                <div
                                    className="cursor-pointer"
                                    onClick={closeModal}
                                >
                                    <img src={CloseIcon} alt="Close" className="w-6 h-6" />
                                </div>
                            </div>
                            <input
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded mb-4"
                                placeholder="Enter new item"
                                value={newItem}
                                onChange={(e) => handleInputChange(e.target.value)}
                            />
                            <div
                                className={`text-white cursor-pointer text-center py-2 px-4 rounded ${
                                    isButtonEnabled
                                        ? 'bg-green-600 hover:bg-green-700'
                                        : 'bg-gray-400'
                                } transition-colors`}
                                onClick={isButtonEnabled ? handleAddItem : undefined}
                            >
                                Add
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile; 