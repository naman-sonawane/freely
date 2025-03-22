import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import AppNavbar from '../App Navbar/AppNavbar';
import ArticleIcon from './assets/ArticleIcon.svg';
import VideoIcon from './assets/VideoIcon.svg';
import LiveIcon from './assets/LiveIcon.svg';
import LinkIcon from './assets/LinkIcon.svg';
import LikeIcon from './assets/LikeIcon.svg';
import LikedIcon from './assets/Liked.svg';
import SaveIcon from './assets/SaveIcon.svg';
import SavedIcon from './assets/Saved.svg';
import  { Navigate } from 'react-router-dom'

interface MediaData {
    type: 'article' | 'video' | 'live';
    url: string;
    title: string;
    description: string;
}

const getIcon = (type: 'article' | 'video' | 'live') => {
    switch (type) {
        case 'article':
            return ArticleIcon;
        case 'video':
            return VideoIcon;
        case 'live':
            return LiveIcon;
        default:
            return '';
    }
};

const extractYouTubeId = (url: string): string | null => {
    const videoIdMatch = url.match(/(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return videoIdMatch ? videoIdMatch[1] : null;
};

const ForYouPage: React.FC = () => {
    const [mediaData, setMediaData] = useState<MediaData[]>([]);
    const [goals, setGoals] = useState<string[]>([]);
    const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [likedItems, setLikedItems] = useState<{ [key: number]: boolean }>({});
    const [savedItems, setSavedItems] = useState<{ [key: number]: boolean }>({});

    const fetchUserGoals = async (username: string) => {
        try {
            const response = await axios.get('http://localhost:5000/api/users/profile', {
                params: { username }
            });
            return response.data.goals;
        } catch (error) {
            console.error('Error fetching user goals:', error);
            return [];
        }
    };

    const generateContent = async (goalsToUse: string[]) => {
        setLoading(true);
        try {
            const goalsString = goalsToUse.join(', ');
            const prompt = `
              Create a list of articles, resources, or videos, based on someone whose goals are ${goalsString}. Be creative with the descriptions! Randomly pick from which section to generate from each time. Do not mix the topics into one resource. Generate 20 in total. Dont rickroll.
              Provide the list in the following JSON format:
              {
                "links": [
                  {"type": "article" | "video" | "live", "url": "urlhere", "title": "Example Title", "description": "Example Description"}
                ]
              }
            `;
            const response = await axios.post('http://localhost:5000/api/upload', { prompt });
            const rawLinksData = response.data.description;
            const jsonString = rawLinksData.replace(/```json\n|\n```/g, '').trim();
            const linksData = JSON.parse(jsonString);

            setMediaData(linksData.links);
        } catch (error) {
            console.error('Error generating content:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchGoalsAndGenerateContent = async () => {
            const username = Cookies.get('username');

            if (!username) {
                console.error('Username not found in cookies');
                return;
            }

            const userGoals = await fetchUserGoals(username);
            setGoals(userGoals);

            if (selectedGoals.length === 0) {
                await generateContent(userGoals);
            }
        };

        fetchGoalsAndGenerateContent();
    }, [selectedGoals]);

    const handleGoalClick = async (goal: string) => {
        let updatedSelectedGoals = [...selectedGoals];

        if (selectedGoals.includes(goal)) {
            updatedSelectedGoals = selectedGoals.filter((g) => g !== goal);
        } else {
            updatedSelectedGoals.push(goal);
        }

        setSelectedGoals(updatedSelectedGoals);

        if (updatedSelectedGoals.length === 0) {
            await generateContent(goals);
        } else {
            await generateContent(updatedSelectedGoals);
        }
    };

    const toggleLike = (index: number) => {
        setLikedItems((prev) => ({ ...prev, [index]: !prev[index] }));
    };

    const toggleSave = (index: number) => {
        setSavedItems((prev) => ({ ...prev, [index]: !prev[index] }));
    };

    if (!Cookies.get("username")) {
        return <Navigate to="/login" />;
    }
    
    return (
        <div className="w-screen relative border-2 h-screen flex">
            <div className="absolute top-0 left-0 w-full">
                <AppNavbar />
            </div>
            <div className="flex flex-row p-6 w-full max-w-4xl mx-auto mt-4">
                <div className="w-1/4 p-4 bg-white border border-gray-300 rounded-lg shadow-sm mr-4">
                    <h2 className="text-lg font-semibold mb-4">Your Goals</h2>
                    <div className="space-y-2">
                        {goals.map((goal, index) => (
                            <div
                                key={index}
                                onClick={() => handleGoalClick(goal)}
                                className={`p-3 bg-gray-100 border ${selectedGoals.includes(goal) ? 'border-blue-500' : 'border-gray-300'} rounded-lg cursor-pointer`}
                            >
                                <p className="text-gray-700 text-sm">{goal}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="w-3/4">
                    <h1 className="text-2xl font-semibold mb-6 text-center">For You</h1>

                    {loading ? (
                        <div className="flex flex-col items-center space-y-4">
                            <p className="text-center text-lg font-semibold">Compiling your feed, please wait...</p>
                            <div className="relative flex w-full max-w-2xl animate-pulse gap-2 p-4 bg-white border border-gray-300 rounded-lg shadow-sm">
                                <div className="h-12 w-12 rounded-full bg-slate-400"></div>
                                <div className="flex-1">
                                    <div className="mb-1 h-5 w-3/5 rounded-lg bg-slate-400 text-lg"></div>
                                    <div className="h-5 w-[90%] rounded-lg bg-slate-400 text-sm"></div>
                                    <div className="mt-4 h-64 w-full rounded-lg bg-slate-400"></div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center space-y-4 overflow-y-auto" style={{ maxHeight: '80vh' }}>
                            {mediaData.map((media, index) => (
                                <div key={index} className="p-4 bg-white border border-gray-300 rounded-lg shadow-sm w-full max-w-2xl">
                                    <div className="flex items-start">
                                        <img src={getIcon(media.type)} alt={media.type} className="w-8 h-8 mr-4 flex-shrink-0" />
                                        <div className="flex-grow" style={{ maxWidth: 'calc(100% - 48px)' }}>
                                            <a href={media.url} target="_blank" rel="noopener noreferrer" className="text-xl font-semibold text-blue-500 hover:underline">
                                                {media.title}
                                            </a>
                                            <p className="text-gray-600 text-sm">{media.url}</p>
                                            <p className="mt-2 text-gray-700 break-words overflow-hidden text-ellipsis">{media.description}</p>
                                            {media.type === 'video' && extractYouTubeId(media.url) && (
                                                <div className="mt-4">
                                                    <iframe
                                                        width="100%"
                                                        height="315"
                                                        src={`https://www.youtube.com/embed/${extractYouTubeId(media.url)}`}
                                                        title={media.title}
                                                        frameBorder="0"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                        className="rounded-lg"
                                                    ></iframe>
                                                </div>
                                            )}
                                        </div>
                                        <a href={media.url} target="_blank" rel="noopener noreferrer" className="ml-4 flex-shrink-0">
                                            <img src={LinkIcon} alt="Link" className="w-8 h-8" />
                                        </a>
                                    </div>
                                    <hr className="my-4 border-gray-300" />
                                    <div className="px-4">
                                        <div className="flex justify-start space-x-4">
                                            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => toggleLike(index)}>
                                                <img
                                                    src={likedItems[index] ? LikedIcon : LikeIcon}
                                                    alt={likedItems[index] ? 'Liked' : 'Like'}
                                                    className="w-5 h-5 flex-shrink-0"
                                                />
                                                <span className={`text-sm ${likedItems[index] ? 'text-red-500' : 'text-gray-600'}`}>
                                                    {likedItems[index] ? 'Liked' : 'Like'}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => toggleSave(index)}>
                                                <img
                                                    src={savedItems[index] ? SavedIcon : SaveIcon}
                                                    alt={savedItems[index] ? 'Saved' : 'Save'}
                                                    className="w-5 h-5 flex-shrink-0"
                                                />
                                                <span className={`text-sm ${savedItems[index] ? 'text-yellow-500' : 'text-gray-600'}`}>
                                                    {savedItems[index] ? 'Saved' : 'Save'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForYouPage;
