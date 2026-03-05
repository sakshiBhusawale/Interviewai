import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Loader2, CheckCircle2, AlertCircle, Award, Lightbulb, ArrowRight } from 'lucide-react';

const EvaluationPage = () => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleEvaluate = async (e) => {
        e.preventDefault();
        if (!question || !answer) return;

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const response = await fetch('http://localhost:5000/api/evaluate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question, answer }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Evaluation failed');
            }

            setResult(data.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-32 pb-20 px-4 sm:px-6 bg-[#F9FAFB] min-h-screen">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-4"
                    >
                        <Award className="w-3.5 h-3.5" />
                        AI Answer Grader
                    </motion.div>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
                        Improve Your <span className="text-indigo-600">Responses</span>
                    </h1>
                    <p className="text-gray-500 text-lg">
                        Paste an interview question and your answer to get detailed AI feedback and scoring.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Input Section */}
                    <div className="lg:col-span-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100"
                        >
                            <form onSubmit={handleEvaluate} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">The Question</label>
                                    <textarea
                                        required
                                        value={question}
                                        onChange={(e) => setQuestion(e.target.value)}
                                        placeholder="e.g. How do you handle conflict in a team?"
                                        className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all min-h-[100px] text-gray-800"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Your Answer</label>
                                    <textarea
                                        required
                                        value={answer}
                                        onChange={(e) => setAnswer(e.target.value)}
                                        placeholder="Type your response here..."
                                        className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all min-h-[200px] text-gray-800"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || !question || !answer}
                                    className="w-full h-14 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:grayscale"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Analyzing with AI...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-5 h-5" />
                                            Evaluate Answer
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </div>

                    {/* Results Section */}
                    <AnimatePresence>
                        {(result || error) && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="lg:col-span-12"
                            >
                                {error ? (
                                    <div className="bg-red-50 border border-red-100 rounded-3xl p-6 flex items-start gap-4">
                                        <AlertCircle className="w-6 h-6 text-red-600 shrink-0" />
                                        <div>
                                            <h3 className="font-bold text-red-900">Analysis Error</h3>
                                            <p className="text-red-700">{error}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {/* Score Card */}
                                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />

                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                                                <div>
                                                    <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm uppercase tracking-wider mb-1">
                                                        <CheckCircle2 className="w-4 h-4" />
                                                        Evaluation Complete
                                                    </div>
                                                    <h2 className="text-3xl font-extrabold text-gray-900">Performance Report</h2>
                                                </div>

                                                <div className="flex items-center gap-4 bg-indigo-50 px-6 py-4 rounded-2xl border border-indigo-100">
                                                    <span className="text-4xl font-black text-indigo-600">{result.score}</span>
                                                    <div className="w-px h-8 bg-indigo-200" />
                                                    <span className="text-sm font-bold text-indigo-700 leading-tight">AI<br />SCORE</span>
                                                </div>
                                            </div>

                                            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                                {/* Feedback */}
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-2 text-gray-900 font-bold">
                                                        <Lightbulb className="w-5 h-5 text-amber-500" />
                                                        What was good
                                                    </div>
                                                    <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                                        {result.feedback}
                                                    </p>
                                                </div>

                                                {/* Improvements */}
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-2 text-gray-900 font-bold">
                                                        <ArrowRight className="w-5 h-5 text-indigo-600" />
                                                        How to improve
                                                    </div>
                                                    <p className="text-gray-600 leading-relaxed bg-indigo-50/50 p-4 rounded-2xl border border-indigo-50/50">
                                                        {result.improvement}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default EvaluationPage;
