import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Send, Sparkles, AlertCircle, CheckCircle2, Trophy, ArrowRight, Loader2, RefreshCcw, BookOpen, LayoutGrid, ChevronRight, ChevronLeft, Lightbulb } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MockTestPage = () => {
    const { examId } = useParams();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isFinished, setIsFinished] = useState(false);
    const [timeLeft, setTimeLeft] = useState(5400); // 90 minutes default
    const [activeSection, setActiveSection] = useState('');
    const [cheatWarning, setCheatWarning] = useState(false);
    const { user } = useAuth();
    const chatEndRef = useRef(null);

    useEffect(() => {
        const handleBlur = () => {
            if (questions.length > 0 && !isFinished) {
                setCheatWarning(true);
            }
        };

        const handleContextMenu = (e) => {
            if (questions.length > 0 && !isFinished) {
                e.preventDefault();
            }
        };

        const handleKeyDown = (e) => {
            if (questions.length > 0 && !isFinished) {
                if (
                    (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) ||
                    (e.ctrlKey && (e.key === 'U' || e.key === 'u' || e.key === 'S' || e.key === 's')) ||
                    e.key === 'F12'
                ) {
                    e.preventDefault();
                }
            }
        };

        window.addEventListener('blur', handleBlur);
        window.addEventListener('contextmenu', handleContextMenu);
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('blur', handleBlur);
            window.removeEventListener('contextmenu', handleContextMenu);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [questions.length, isFinished]);

    useEffect(() => {
        fetchMCQs();
    }, [examId]);

    useEffect(() => {
        if (timeLeft > 0 && questions.length > 0 && !isFinished) {
            const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0 && questions.length > 0 && !isFinished) {
            finishTest();
        }
    }, [timeLeft, questions.length, isFinished]);

    const fetchMCQs = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/mcq/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ category: examId, count: 20 }), // Optimized count for reliability
            });
            const data = await response.json();
            if (response.ok) {
                setQuestions(data.data);
                if (data.data.length > 0) {
                    setActiveSection(data.data[0].section || 'General');
                }
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            setError('Failed to load test questions. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (option) => {
        setSelectedAnswers({ ...selectedAnswers, [currentIndex]: option });
    };

    const finishTest = async () => {
        setIsFinished(true);
        const score = calculateScore();

        try {
            await fetch('http://localhost:5000/api/results/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user?._id || user?.id,
                    type: 'MCQ',
                    score: score,
                    totalScore: questions.length,
                    category: examId || 'General'
                }),
            });
        } catch (err) {
            console.error('Failed to save test result:', err);
        }
    };

    const calculateScore = () => {
        let score = 0;
        questions.forEach((q, idx) => {
            if (selectedAnswers[idx] === q.correctAnswer) {
                score++;
            }
        });
        return score;
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const sections = [...new Set(questions.map(q => q.section || 'General'))];

    if (loading) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-[#F9FAFB]">
                <div className="relative">
                    <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mb-6" />
                    <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-amber-400 animate-pulse" />
                </div>
                <p className="text-gray-900 font-black text-2xl mb-2">SkillForge AI</p>
                <p className="text-gray-500 font-medium">Assembling your section-wise mock test...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-screen flex flex-col items-center justify-center px-4 bg-[#F9FAFB]">
                <AlertCircle className="w-16 h-16 text-red-500 mb-6" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
                <p className="text-gray-500 mb-8">{error}</p>
                <button onClick={() => window.location.reload()} className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                    Try Again
                </button>
            </div>
        );
    }

    if (isFinished) {
        const score = calculateScore();
        const percentage = (score / questions.length) * 100;

        return (
            <div className="pt-24 pb-20 px-4 sm:px-6 bg-[#F9FAFB] min-h-screen">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-white p-12 rounded-[40px] shadow-sm border border-gray-100 text-center relative overflow-hidden mb-8">
                        <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600" />
                        <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
                        <h1 className="text-4xl font-black text-gray-900 mb-4">Performance Summary</h1>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
                            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Score</p>
                                <p className="text-2xl font-black text-indigo-600">{score * 2} / {questions.length * 2}</p>
                            </div>
                            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Accuracy</p>
                                <p className="text-2xl font-black text-green-600">{Math.round(percentage)}%</p>
                            </div>
                            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Correct</p>
                                <p className="text-2xl font-black text-gray-900 font-black">{score}</p>
                            </div>
                            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Incorrect</p>
                                <p className="text-2xl font-black text-red-600">{questions.length - score}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                            <Lightbulb className="w-6 h-6 text-amber-500" />
                            Review & Explanations
                        </h2>
                        {questions.map((q, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                                        {q.section}
                                    </span>
                                    {selectedAnswers[idx] === q.correctAnswer ? (
                                        <span className="text-green-600 font-bold text-sm flex items-center gap-1">
                                            <CheckCircle2 className="w-4 h-4" /> Correct
                                        </span>
                                    ) : (
                                        <span className="text-red-600 font-bold text-sm flex items-center gap-1">
                                            <AlertCircle className="w-4 h-4" /> Incorrect
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-6">{idx + 1}. {q.question}</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    {q.options.map((opt, i) => (
                                        <div
                                            key={i}
                                            className={`p-4 rounded-2xl border-2 text-sm font-medium ${opt === q.correctAnswer
                                                ? 'border-green-500 bg-green-50 text-green-700'
                                                : selectedAnswers[idx] === opt
                                                    ? 'border-red-500 bg-red-50 text-red-700'
                                                    : 'border-gray-50 bg-gray-50 text-gray-500'
                                                }`}
                                        >
                                            {opt}
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                                    <p className="text-blue-900 font-bold text-xs uppercase tracking-widest mb-2">AI Explanation</p>
                                    <p className="text-blue-800 text-sm leading-relaxed">{q.explanation || 'No explanation available.'}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="flex gap-4 mt-12">
                        <button onClick={() => navigate('/exams')} className="flex-1 h-14 bg-gray-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all">
                            Back to Dashboard
                        </button>
                        <button onClick={() => window.location.reload()} className="flex-1 h-14 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
                            <RefreshCcw className="w-5 h-5" /> Retake Mock Test
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const currentQ = questions[currentIndex];

    return (
        <div className="pt-24 pb-20 px-4 sm:px-6 bg-[#F9FAFB] min-h-screen relative">

            {/* Anti-Cheat Warning Overlay */}
            <AnimatePresence>
                {cheatWarning && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-sm p-6"
                    >
                        <div className="bg-white border-2 border-red-500 rounded-[40px] p-10 max-w-md text-center shadow-2xl relative">
                            <AlertCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
                            <h2 className="text-3xl font-black text-gray-900 mb-4 uppercase tracking-tight">Cheat Detection</h2>
                            <p className="text-gray-600 mb-8 font-medium leading-relaxed">
                                You are not allowed to switch tabs or leave the test window. This incident has been recorded.
                            </p>
                            <button
                                onClick={() => setCheatWarning(false)}
                                className="w-full h-14 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
                            >
                                I am sorry, I'll continue
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-7xl mx-auto">

                {/* Test Header */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
                    <div className="lg:col-span-9">
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                                    <BookOpen className="w-6 h-6" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-black text-gray-900 uppercase tracking-tight">{examId} Mock Test</h1>
                                    <div className="flex items-center gap-2 text-gray-400 font-bold text-[10px] uppercase tracking-widest">
                                        <Sparkles className="w-3 h-3 text-amber-500" /> Session Active
                                    </div>
                                </div>
                            </div>

                            {/* Section Navigation */}
                            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
                                {sections.map(sec => (
                                    <button
                                        key={sec}
                                        onClick={() => {
                                            setActiveSection(sec);
                                            const firstInSec = questions.findIndex(q => (q.section || 'General') === sec);
                                            setCurrentIndex(firstInSec);
                                        }}
                                        className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeSection === sec
                                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                                            : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                                            }`}
                                    >
                                        {sec}
                                    </button>
                                ))}
                            </div>

                            <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl border font-black text-xl ${timeLeft < 300 ? 'bg-red-50 text-red-600 border-red-100 animate-pulse' : 'bg-gray-950 text-white border-gray-900 shadow-xl shadow-gray-200'}`}>
                                <Clock className="w-5 h-5" />
                                {formatTime(timeLeft)}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-3">
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-full flex items-center justify-center">
                            <button
                                onClick={() => { if (window.confirm('Are you sure you want to finish the test?')) finishTest() }}
                                className="w-full h-12 bg-red-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-100"
                            >
                                Finish Test Early
                            </button>
                        </div>
                    </div>
                </div>

                {/* Question Area */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-9">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm min-h-[500px] flex flex-col"
                            >
                                <div className="flex items-center justify-between mb-8">
                                    <span className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-2xl text-xs font-black uppercase tracking-widest">
                                        Section: {currentQ.section || 'General'}
                                    </span>
                                    <span className="text-gray-300 font-black text-4xl">
                                        {currentIndex + 1 < 10 ? `0${currentIndex + 1}` : currentIndex + 1}
                                    </span>
                                </div>

                                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-12 leading-tight">
                                    {currentQ.question}
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                                    {currentQ.options.map((option, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleSelect(option)}
                                            className={`p-6 rounded-3xl border-2 text-left transition-all relative group flex items-center gap-4 ${selectedAnswers[currentIndex] === option
                                                ? 'border-indigo-600 bg-indigo-50/50'
                                                : 'border-gray-50 bg-gray-50/30 hover:bg-white hover:border-gray-200'
                                                }`}
                                        >
                                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 border-2 transition-all ${selectedAnswers[currentIndex] === option
                                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100'
                                                : 'bg-white border-gray-100 text-gray-400 group-hover:border-indigo-200 group-hover:text-indigo-600'
                                                }`}>
                                                {String.fromCharCode(65 + idx)}
                                            </div>
                                            <span className={`font-bold text-sm ${selectedAnswers[currentIndex] === option ? 'text-indigo-900' : 'text-gray-600'}`}>
                                                {option}
                                            </span>
                                        </button>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-50">
                                    <button
                                        onClick={() => setCurrentIndex(prev => prev - 1)}
                                        disabled={currentIndex === 0}
                                        className="flex items-center gap-2 font-black text-sm uppercase tracking-widest text-gray-400 hover:text-indigo-600 disabled:opacity-0 transition-all font-inter"
                                    >
                                        <ChevronLeft className="w-5 h-5" /> Previous
                                    </button>

                                    <div className="flex gap-2">
                                        {questions.map((_, i) => (
                                            <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${i === currentIndex ? 'w-6 bg-indigo-600' : selectedAnswers[i] ? 'bg-indigo-300' : 'bg-gray-100'}`} />
                                        ))}
                                    </div>

                                    {currentIndex === questions.length - 1 ? (
                                        <button
                                            onClick={finishTest}
                                            className="px-10 h-14 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center gap-2"
                                        >
                                            Submit Final Test <ChevronRight className="w-5 h-5" />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                const nextIdx = currentIndex + 1;
                                                setCurrentIndex(nextIdx);
                                                setActiveSection(questions[nextIdx].section || 'General');
                                            }}
                                            className="px-10 h-14 bg-gray-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-800 transition-all flex items-center gap-2"
                                        >
                                            Next Question <ChevronRight className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="lg:col-span-3">
                        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm h-full max-h-[600px] flex flex-col">
                            <div className="flex items-center gap-2 text-gray-400 font-bold text-[10px] uppercase tracking-widest mb-6 pb-4 border-b border-gray-50">
                                <LayoutGrid className="w-4 h-4 text-indigo-600" /> Navigation Grid
                            </div>

                            <div className="grid grid-cols-4 gap-3 overflow-y-auto pr-2 custom-scrollbar">
                                {questions.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            setCurrentIndex(idx);
                                            setActiveSection(questions[idx].section || 'General');
                                        }}
                                        className={`w-12 h-12 rounded-2xl font-black text-xs transition-all border-2 flex items-center justify-center ${currentIndex === idx
                                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-lg shadow-indigo-100 scale-110 z-10'
                                            : selectedAnswers[idx]
                                                ? 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-100'
                                                : 'bg-gray-50 border-gray-50 text-gray-400 hover:border-gray-200'
                                            }`}
                                    >
                                        {idx + 1}
                                    </button>
                                ))}
                            </div>

                            <div className="mt-auto pt-6 space-y-4">
                                <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-tighter">
                                    <span className="text-gray-400">Answered</span>
                                    <span className="text-green-600">{Object.keys(selectedAnswers).length} / {questions.length}</span>
                                </div>
                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(Object.keys(selectedAnswers).length / questions.length) * 100}%` }}
                                        className="h-full bg-green-500"
                                    />
                                </div>
                                <div className="p-4 bg-indigo-50 rounded-2xl border border-dashed border-indigo-200">
                                    <p className="text-[10px] text-indigo-700 font-bold leading-relaxed">
                                        Tip: You can jump between sections using the tabs at the top.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MockTestPage;
