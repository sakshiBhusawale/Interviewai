import React from 'react';
import { Loader2, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const GeneratorForm = ({
    skill,
    setSkill,
    difficulty,
    setDifficulty,
    numQuestions,
    setNumQuestions,
    loading,
    onGenerate
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-xl mx-auto"
        >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            Technology / Skill
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. React.js, Python, System Design"
                            value={skill}
                            onChange={(e) => setSkill(e.target.value)}
                            className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-gray-400"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Difficulty Level</label>
                            <select
                                value={difficulty}
                                onChange={(e) => setDifficulty(e.target.value)}
                                className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all appearance-none cursor-pointer"
                            >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                                <option value="Expert">Expert</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">No. of Questions</label>
                            <input
                                type="number"
                                min="1"
                                max="10"
                                value={numQuestions}
                                onChange={(e) => setNumQuestions(e.target.value)}
                                className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading || !skill}
                        onClick={onGenerate}
                        className="w-full h-12 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-indigo-200"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Generating Questions...
                            </>
                        ) : (
                            <>
                                <Zap className="w-5 h-5" />
                                Generate Questions
                            </>
                        )}
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default GeneratorForm;
