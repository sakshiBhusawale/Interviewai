import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, AlertCircle } from 'lucide-react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import GeneratorForm from './components/GeneratorForm'
import QuestionCard from './components/QuestionCard'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import EvaluationPage from './pages/EvaluationPage'
import SimulationPage from './pages/SimulationPage'
import ExamsPage from './pages/ExamsPage'
import MockTestPage from './pages/MockTestPage'
import GuidePage from './pages/GuidePage'

const normalizeQuestions = (payload) => {
  if (!payload) return []
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload.questions)) return payload.questions
  if (payload.data && Array.isArray(payload.data.questions)) return payload.data.questions
  if (payload.data && Array.isArray(payload.data)) return payload.data
  return []
}

function Generator() {
  const [skill, setSkill] = useState('')
  const [difficulty, setDifficulty] = useState('Intermediate')
  const [numQuestions, setNumQuestions] = useState(5)
  const [questions, setQuestions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('http://localhost:5000/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skill, difficulty, numberOfQuestions: numQuestions }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || response.statusText || 'Failed to generate questions')
      }

      const data = await response.json()
      const normalized = normalizeQuestions(data)

      if (!normalized.length) {
        throw new Error('No questions were returned by the AI. Try a different skill.')
      }

      setQuestions(normalized)
    } catch (err) {
      setQuestions([])
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="pt-32 pb-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-4"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Powered by Advanced Groq AI
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4"
          >
            Master Your Next <span className="text-indigo-600">Interview</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-lg max-w-2xl mx-auto"
          >
            Generate high-quality, relevant interview questions for any skill in seconds.
            Perfect for recruiters and job seekers alike.
          </motion.p>
        </div>

        {/* Generator Form */}
        <GeneratorForm
          skill={skill}
          setSkill={setSkill}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          numQuestions={numQuestions}
          setNumQuestions={setNumQuestions}
          loading={isLoading}
          onGenerate={handleGenerate}
        />

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="max-w-xl mx-auto mt-6"
            >
              <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-red-800">Generation Failed</p>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Section */}
        <AnimatePresence>
          {questions.length > 0 && !isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-20"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Generated Questions</h2>
                <div className="px-3 py-1 bg-gray-100 rounded-lg text-sm font-semibold text-gray-600">
                  {questions.length} Results
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {questions.map((q, idx) => (
                  <QuestionCard
                    key={idx}
                    index={idx}
                    question={q.question || q}
                    answer={q.answer || "No answer provided."}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#F9FAFB]">
        <Navbar />

        <Routes>
          <Route path="/" element={<Generator />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/evaluate" element={<EvaluationPage />} />
          <Route path="/simulate" element={<SimulationPage />} />
          <Route path="/exams" element={<ExamsPage />} />
          <Route path="/mock-test/:examId" element={<MockTestPage />} />
          <Route path="/guide/:examId" element={<GuidePage />} />
        </Routes>

        {/* Footer */}
        <footer className="border-t border-gray-100 py-12 bg-white mt-auto">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-sm text-gray-400">
              &copy; 2026 SkillForge AI. All rights reserved. Built for excellence.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App
