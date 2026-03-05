import React from 'react';
import { Sparkles, LogOut, User as UserIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-indigo-100 flex items-center justify-center bg-indigo-600">
                            <img src="/logo.png" alt="SkillForge AI Logo" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-800">
                            SkillForge AI
                        </span>
                    </Link>
                    <div className="hidden md:flex items-center gap-8">
                        <Link to="/" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">Generator</Link>
                        <Link to="/evaluate" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">Evaluate</Link>
                        <Link to="/simulate" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">Simulate</Link>
                        <Link to="/exams" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">Exams</Link>
                    </div>
                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                                        <UserIcon className="w-3.5 h-3.5 text-indigo-600" />
                                    </div>
                                    <span className="text-xs font-bold text-gray-700">{user.name}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                    title="Logout"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">Log in</Link>
                                <Link to="/signup" className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                                    Sign up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
