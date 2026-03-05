import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Loader2, User, Bot, Terminal, RefreshCcw, LogOut, Award, CheckCircle2, Lightbulb, ArrowRight, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SimulationPage = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [started, setStarted] = useState(false);
    const [cheatWarning, setCheatWarning] = useState(false);
    const [evaluation, setEvaluation] = useState(null);
    const [isFlagged, setIsFlagged] = useState(false);
    const { user } = useAuth();
    const chatEndRef = useRef(null);

    useEffect(() => {
        const handleBlur = () => {
            if (started) {
                setCheatWarning(true);
                setIsFlagged(true);
            }
        };

        const handleFullscreenChange = () => {
            if (started && !document.fullscreenElement) {
                setCheatWarning(true);
                setIsFlagged(true);
            }
        };

        const handleContextMenu = (e) => {
            if (started) {
                e.preventDefault();
            }
        };

        const handleKeyDown = (e) => {
            if (started) {
                // Disable common inspection/copy shortcuts
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
        document.addEventListener('fullscreenchange', handleFullscreenChange);

        return () => {
            window.removeEventListener('blur', handleBlur);
            window.removeEventListener('contextmenu', handleContextMenu);
            window.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, [started]);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const startInterview = async () => {
        try {
            await document.documentElement.requestFullscreen();
        } catch (err) {
            console.error('Failed to enter fullscreen:', err);
        }
        setStarted(true);
        setLoading(true);
        setIsFlagged(false);
        const initialMessages = [
            { role: 'user', content: 'Hi, I am ready to start the interview. Please ask me the first question.' }
        ];

        try {
            const response = await fetch('http://localhost:5000/api/simulate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: initialMessages }),
            });
            const data = await response.json();
            if (response.ok) {
                setMessages([{ role: 'assistant', content: data.data }]);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading || evaluation) return;

        const userMessage = { role: 'user', content: input };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/simulate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: newMessages }),
            });
            const data = await response.json();
            if (response.ok) {
                setMessages([...newMessages, { role: 'assistant', content: data.data }]);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const endInterview = async () => {
        if (messages.length < 2 || loading) return;

        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/simulate/evaluate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages,
                    userId: user?._id || user?.id,
                    category: 'Technical Interview',
                    wasFlagged: isFlagged
                }),
            });
            const data = await response.json();
            if (response.ok) {
                setEvaluation(data.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-24 pb-10 h-screen flex flex-col bg-[#F9FAFB]">
            <div className="max-w-4xl w-full mx-auto flex-1 flex flex-col px-4 sm:px-6 relative">

                {/* Anti-Cheat Warning Overlay */}
                <AnimatePresence>
                    {cheatWarning && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-sm p-6"
                        >
                            <div className="bg-white border-2 border-red-500 rounded-3xl p-8 max-w-md text-center shadow-2xl">
                                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Warning: Window Blur Detected</h2>
                                <p className="text-gray-600 mb-6">
                                    Switching tabs or minimizing the window is not allowed during the simulation. This incident will be logged.
                                </p>
                                <button
                                    onClick={() => setCheatWarning(false)}
                                    className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                                >
                                    I Understand
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Terminal className="w-6 h-6 text-indigo-600" />
                            Interview Simulation
                        </h1>
                        <p className="text-sm text-gray-500">Practice your skills in a realistic conversation.</p>
                    </div>
                    {started && !evaluation && (
                        <div className="flex gap-2">
                            <button
                                onClick={endInterview}
                                disabled={loading || messages.length < 2}
                                className="px-4 py-2 text-sm font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
                            >
                                <CheckCircle2 className="w-4 h-4" /> End & Evaluate
                            </button>
                            <button
                                onClick={() => { setStarted(false); setMessages([]); setEvaluation(null); }}
                                className="px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-all flex items-center gap-2"
                            >
                                <RefreshCcw className="w-4 h-4" /> Reset
                            </button>
                        </div>
                    )}
                    {evaluation && (
                        <button
                            onClick={() => { setStarted(false); setMessages([]); setEvaluation(null); }}
                            className="px-4 py-2 text-sm font-bold text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all flex items-center gap-2"
                        >
                            <RefreshCcw className="w-4 h-4" /> New Interview
                        </button>
                    )}
                </div>

                {/* Chat Area */}
                <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 mb-6 flex flex-col overflow-hidden">
                    {!started ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                            <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-indigo-100">
                                <Bot className="w-10 h-10 text-indigo-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to start?</h2>
                            <p className="text-gray-500 max-w-sm mb-8">
                                The AI will act as a professional interviewer. Answer the questions as you would in a real interview.
                            </p>
                            <button
                                onClick={startInterview}
                                className="px-8 h-14 bg-indigo-600 text-white rounded-2xl font-bold flex items-center gap-3 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                            >
                                <Sparkles className="w-5 h-5" />
                                Start Simulation
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-200">
                                {messages.map((msg, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[80%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                                                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                                            </div>
                                            <div className={`p-4 rounded-2xl ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-gray-50 text-gray-800 rounded-tl-none border border-gray-100'}`}>
                                                <p className="text-sm leading-relaxed">{msg.content}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                                {loading && (
                                    <div className="flex justify-start">
                                        <div className="max-w-[80%] flex gap-3">
                                            <div className="w-10 h-10 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center shrink-0">
                                                <Bot className="w-5 h-5 animate-pulse" />
                                            </div>
                                            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 rounded-tl-none">
                                                <div className="flex gap-1">
                                                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" />
                                                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                                                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            {/* Input Area */}
                            {!evaluation && (
                                <div className="p-4 border-t border-gray-50 bg-white">
                                    <form onSubmit={handleSend} className="relative">
                                        <input
                                            type="text"
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onPaste={(e) => {
                                                if (started) {
                                                    e.preventDefault();
                                                }
                                            }}
                                            placeholder="Type your response..."
                                            disabled={loading}
                                            className="w-full h-14 pl-6 pr-16 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-gray-400"
                                        />
                                        <button
                                            type="submit"
                                            disabled={loading || !input.trim()}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:grayscale shadow-lg shadow-indigo-100"
                                        >
                                            <Send className="w-4 h-4" />
                                        </button>
                                    </form>
                                </div>
                            )}

                            {/* Evaluation Report */}
                            <AnimatePresence>
                                {evaluation && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-6 border-t border-gray-100 bg-white overflow-y-auto max-h-[60%] custom-scrollbar"
                                    >
                                        <div className="flex flex-col gap-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
                                                        <Award className="w-4 h-4" />
                                                        Session Evaluation
                                                    </div>
                                                    <h3 className="text-xl font-black text-gray-900">Performance Report</h3>
                                                </div>
                                                <div className="flex items-center gap-3 bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100">
                                                    <span className="text-3xl font-black text-indigo-600">{evaluation.score}</span>
                                                    <div className="w-px h-6 bg-indigo-200" />
                                                    <span className="text-[10px] font-bold text-indigo-700 leading-tight uppercase">AI<br />Score</span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                                    <div className="flex items-center gap-2 text-gray-900 font-bold text-sm mb-2">
                                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                        What went well
                                                    </div>
                                                    <p className="text-xs text-gray-600 leading-relaxed">{evaluation.feedback}</p>
                                                </div>
                                                <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-50">
                                                    <div className="flex items-center gap-2 text-gray-900 font-bold text-sm mb-2">
                                                        <Lightbulb className="w-4 h-4 text-amber-500" />
                                                        Suggestions
                                                    </div>
                                                    <p className="text-xs text-indigo-900/70 leading-relaxed">{evaluation.improvement}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SimulationPage;
