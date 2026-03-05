import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Trophy, TrendingUp, Calendar, Target, Award, ArrowUpRight, Loader2, Sparkles, LayoutGrid } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
    const { user } = useAuth();
    const [progressData, setProgressData] = useState([]);
    const [percentile, setPercentile] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const userId = user?._id || user?.id;

            // Fetch progress data
            const progressRes = await fetch(`http://localhost:5000/api/results/progress/${userId}`);
            const progressJson = await progressRes.json();
            if (progressJson.success) setProgressData(progressJson.data);

            // Fetch percentile
            const percentileRes = await fetch(`http://localhost:5000/api/results/percentile/${userId}`);
            const percentileJson = await percentileRes.json();
            if (percentileJson.success) setPercentile(percentileJson.percentile);

        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-[#F9FAFB]">
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Loading your performance dashboard...</p>
            </div>
        );
    }

    return (
        <div className="pt-24 pb-20 px-4 sm:px-6 bg-[#F9FAFB] min-h-screen">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                            <LayoutGrid className="w-8 h-8 text-indigo-600" />
                            Performance Dashboard
                        </h1>
                        <p className="text-gray-500 font-medium mt-1">Monitor your growth and technical proficiency.</p>
                    </div>
                    <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                        <div className="px-4 py-2 bg-indigo-50 rounded-xl text-indigo-700 text-xs font-black uppercase tracking-wider">
                            Daily Updates
                        </div>
                        <div className="flex -space-x-2 mr-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-[10px] font-bold">U{i}</div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Percentile Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl shadow-gray-200"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-bl-full -mr-16 -mt-16" />
                        <Trophy className="w-10 h-10 text-amber-400 mb-6" />
                        <h3 className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">Global Percentile</h3>
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black">{percentile}</span>
                            <span className="text-xl font-bold text-gray-400">th</span>
                        </div>
                        <p className="text-gray-400 text-sm mt-4 leading-relaxed">
                            You are performing better than <span className="text-indigo-400 font-bold">{percentile}%</span> of candidates.
                        </p>
                    </motion.div>

                    {/* Score Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm relative overflow-hidden"
                    >
                        <TrendingUp className="w-10 h-10 text-indigo-600 mb-6" />
                        <h3 className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">Average Score</h3>
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black text-gray-900">
                                {progressData.length > 0 ? Math.round(progressData.reduce((a, b) => a + b.score, 0) / progressData.length) : 0}
                            </span>
                            <span className="text-xl font-bold text-gray-400">%</span>
                        </div>
                        <div className="flex items-center gap-1 text-green-500 text-sm font-bold mt-4">
                            <ArrowUpRight className="w-4 h-4" />
                            <span>Keep pushing!</span>
                        </div>
                    </motion.div>

                    {/* Activity Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm relative overflow-hidden"
                    >
                        <Calendar className="w-10 h-10 text-rose-500 mb-6" />
                        <h3 className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">Total Assessments</h3>
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black text-gray-900">{progressData.length}</span>
                            <span className="text-xl font-bold text-gray-400">Sessions</span>
                        </div>
                        <p className="text-gray-400 text-sm mt-4 leading-relaxed">
                            Consistent practice leads to consistent improvement.
                        </p>
                    </motion.div>
                </div>

                {/* Main Chart Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm flex flex-col"
                >
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Daily Progress</h2>
                            <p className="text-gray-400 text-sm font-medium">Your score history over time</p>
                        </div>
                        <div className="px-4 py-2 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-indigo-600" />
                            <span className="text-xs font-bold text-gray-600">Last 7 Sessions</span>
                        </div>
                    </div>

                    <div className="h-[400px] w-full">
                        {progressData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={progressData}>
                                    <defs>
                                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                    <XAxis
                                        dataKey="date"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 700 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 700 }}
                                        domain={[0, 100]}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#111827',
                                            border: 'none',
                                            borderRadius: '16px',
                                            color: '#fff',
                                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                                        }}
                                        itemStyle={{ color: '#818CF8', fontWeight: 'bold' }}
                                        labelStyle={{ color: '#9CA3AF', marginBottom: '4px' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="score"
                                        stroke="#4F46E5"
                                        strokeWidth={4}
                                        fillOpacity={1}
                                        fill="url(#colorScore)"
                                        animationDuration={2000}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                <Target className="w-12 h-12 mb-4 opacity-20" />
                                <p className="font-bold">No progress data available yet.</p>
                                <p className="text-xs">Take your first interview or mock test to see charts!</p>
                            </div>
                        )}
                    </div>
                </motion.div>

            </div>
        </div>
    );
};

export default DashboardPage;
