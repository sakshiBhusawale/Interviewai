import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft, BookOpen, Lightbulb, CheckCircle, Target, Award } from 'lucide-react';

const guideData = {
    'mah-mca-cet': {
        title: 'MAH MCA CET 2026 Guide',
        sections: [
            { title: 'Mathematics', items: ['Coordinate Geometry', 'Probability', 'Statistics', 'Arithmetic', 'Algebra'] },
            { title: 'Logical Reasoning', items: ['Coding-Decoding', 'Blood Relations', 'Seating Arrangements', 'Puzzles'] },
            { title: 'Computer Concepts', items: ['Networking', 'Data Structures', 'Operating Systems', 'OOPs', 'Binary Arithmetic'] }
        ]
    },
    'nimcet': {
        title: 'NIMCET Comprehensive Guide',
        sections: [
            { title: 'Maths (High Weightage)', items: ['Vectors', 'Probability', 'Logarithms', 'Trigonometry'] },
            { title: 'Analytical Ability', items: ['Logical reasoning', 'Quantitative Aptitude'] },
            { title: 'Basic Computers', items: ['Memory management', 'Data representation', 'Logic gates'] }
        ]
    },
    'react-test': {
        title: 'Essential React Roadmap',
        sections: [
            { title: 'Core Concepts', items: ['Virtual DOM', 'JSX', 'Components (Class vs Functional)', 'Props & State'] },
            { title: 'Advanced Topics', items: ['React Hooks', 'Context API', 'State Management (Redux/Zustand)', 'Server-Side Rendering'] },
            { title: 'Project Structure', items: ['Best Practices', 'Testing with Jest', 'React Router'] }
        ]
    }
};

const GuidePage = () => {
    const { examId } = useParams();
    const guide = guideData[examId] || { title: `${examId.toUpperCase()} Prep Guide`, sections: [] };

    return (
        <div className="pt-32 pb-20 px-4 sm:px-6 bg-[#F9FAFB] min-h-screen">
            <div className="max-w-4xl mx-auto">

                <Link to="/exams" className="inline-flex items-center gap-2 text-indigo-600 font-bold mb-10 hover:gap-3 transition-all">
                    <ArrowLeft className="w-5 h-5" />
                    Back to Exams
                </Link>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 overflow-hidden relative"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-bl-full -mr-32 -mt-32 border border-indigo-100" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 mb-16">
                        <div className="w-24 h-24 bg-indigo-600 rounded-[32px] flex items-center justify-center shadow-xl shadow-indigo-100">
                            <BookOpen className="w-12 h-12 text-white" />
                        </div>
                        <div>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 rounded-full text-[10px] font-black uppercase text-indigo-600 tracking-widest mb-3"
                            >
                                <Sparkles className="w-3 h-3" /> Updated for 2026
                            </motion.div>
                            <h1 className="text-4xl font-black text-gray-900 leading-tight">{guide.title}</h1>
                        </div>
                    </div>

                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10">

                        {guide.sections.length > 0 ? (
                            guide.sections.map((section, idx) => (
                                <div key={idx} className="space-y-6">
                                    <h3 className="text-xl font-extrabold text-gray-900 flex items-center gap-3">
                                        <Target className="w-6 h-6 text-indigo-600" />
                                        {section.title}
                                    </h3>
                                    <ul className="space-y-3">
                                        {section.items.map((item, i) => (
                                            <li key={i} className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 group hover:bg-white hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-100/30 transition-all cursor-default">
                                                <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                                                <span className="text-gray-700 font-bold">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-2 py-20 text-center">
                                <Lightbulb className="w-16 h-16 text-indigo-100 mx-auto mb-6" />
                                <p className="text-gray-400 font-bold text-xl uppercase tracking-widest">Guide coming soon.</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-20 p-8 rounded-3xl bg-indigo-600 text-white relative flex flex-col items-center text-center shadow-2xl shadow-indigo-200 overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16 blur-3xl" />
                        <Award className="w-12 h-12 mb-4 animate-bounce" />
                        <h4 className="text-2xl font-black mb-2 uppercase tracking-tight">Ready to test yourself?</h4>
                        <p className="text-indigo-100 font-medium mb-8 max-w-sm">Use our high-performance AI tests to check your preparation level now.</p>
                        <Link
                            to={`/mock-test/${examId}`}
                            className="h-14 px-10 bg-white text-indigo-600 rounded-2xl font-black flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-white/20"
                        >
                            Start Mock Test
                            <ArrowLeft className="w-5 h-5 rotate-180" />
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default GuidePage;
