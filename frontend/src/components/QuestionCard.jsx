import React, { useState } from 'react';
import { Copy, Check, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const QuestionCard = ({ question, answer, index }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`Question: ${question}\nAnswer: ${answer}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all group"
    >
      <div className="flex justify-between items-start gap-4 mb-4">
        <div className="flex items-center gap-3 text-indigo-600 font-bold text-sm uppercase tracking-wider">
          <MessageSquare className="w-4 h-4" />
          <span>Question {index + 1}</span>
        </div>
        <button
          onClick={handleCopy}
          className={`p-2 rounded-lg transition-all ${copied ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-600'
            }`}
          title="Copy to clipboard"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>

      <h3 className="text-lg font-bold text-gray-900 mb-3 leading-tight">
        {question}
      </h3>

      <div className="bg-gray-50 rounded-xl p-4">
        <p className="text-sm font-semibold text-gray-500 mb-1 uppercase tracking-tight text-[10px]">Model Answer</p>
        <p className="text-gray-700 leading-relaxed text-sm">
          {answer}
        </p>
      </div>
    </motion.div>
  );
};

export default QuestionCard;
