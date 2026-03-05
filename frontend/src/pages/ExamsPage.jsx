import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BookOpen, GraduationCap, Code, FileText, ArrowRight, Sparkles } from 'lucide-react';

const exams = [
    {
        id: 'mah-mca-cet',
        title: 'MAH MCA CET',
        description: 'Master of Computer Applications Common Entrance Test for Maharashtra.',
        category: 'Entrance Exams',
        icon: GraduationCap,
        color: 'indigo'
    },
    {
        id: 'nimcet',
        title: 'NIMCET',
        description: 'NIT MCA Common Entrance Test for admission to NITs.',
        category: 'Entrance Exams',
        icon: BookOpen,
        color: 'blue'
    },
    {
        id: 'react-test',
        title: 'React.js Mastery',
        description: 'Test your knowledge on modern React, Hooks, and State Management.',
        category: 'Development',
        icon: Code,
        color: 'cyan'
    },
    {
        id: 'c-cpp-test',
        title: 'C/C++ Fundamentals',
        description: 'Advanced assessment on C and C++ programming concepts.',
        category: 'Programming',
        icon: Code,
        color: 'blue'
    },
    {
        id: 'java-test',
        title: 'Java Development',
        description: 'Comprehensive test covering Core Java and OOP principles.',
        category: 'Programming',
        icon: Code,
        color: 'red'
    },
    {
        id: 'python-test',
        title: 'Python Essentials',
        description: 'Evaluate your Python scripting and logic skills.',
        category: 'Programming',
        icon: Code,
        color: 'green'
    }
];

const ExamsPage = () => {
    const navigate = useNavigate();

    return (
        <div className="pt-32 pb-20 px-4 sm:px-6 bg-[#F9FAFB] min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-4"
                    >
                        <BookOpen className="w-3.5 h-3.5" />
                        Learning & Assessment
                    </motion.div>
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
                        Exam & <span className="text-indigo-600">Mock Tests</span>
                    </h1>
                    <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                        Prepare for top entrance exams and technical assessments with our AI-powered mock tests and study guides.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {exams.map((exam, idx) => {
                        const Icon = exam.icon;
                        return (
                            <motion.div
                                key={exam.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="group relative bg-white p-8 rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-xl hover:shadow-indigo-100/50 overflow-hidden"
                            >
                                <div className={`absolute top-0 right-0 w-24 h-24 bg-${exam.color}-50 rounded-bl-full -mr-12 -mt-12 transition-transform group-hover:scale-110`} />

                                <div className={`w-14 h-14 bg-${exam.color}-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-${exam.color}-100 transition-transform group-hover:scale-110 relative z-10 font-bold text-white`}>
                                    <Icon className="w-7 h-7" />
                                </div>

                                <div className="relative z-10">
                                    <div className={`text-xs font-bold text-${exam.color}-600 uppercase tracking-widest mb-1`}>
                                        {exam.category}
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{exam.title}</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed mb-8">
                                        {exam.description}
                                    </p>

                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => navigate(`/mock-test/${exam.id}`)}
                                            className={`flex-1 flex items-center justify-center gap-2 h-12 rounded-xl bg-${exam.color}-600 text-white font-bold text-sm hover:scale-105 transition-all shadow-lg shadow-${exam.color}-100`}
                                        >
                                            Mock Test
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => navigate(`/guide/${exam.id}`)}
                                            className={`flex-1 h-12 rounded-xl border-2 border-${exam.color}-100 text-${exam.color}-600 font-bold text-sm hover:bg-${exam.color}-50 transition-all`}
                                        >
                                            View Guide
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ExamsPage;
