import { Layers3, SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'

const SKILLS = ['React', 'Node.js', 'MongoDB', 'SQL', 'JavaScript']
const DIFFICULTY_LEVELS = ['Easy', 'Medium', 'Hard']

const InterviewForm = ({ isLoading, onSubmit }) => {
  const [skill, setSkill] = useState(SKILLS[0])
  const [difficulty, setDifficulty] = useState(DIFFICULTY_LEVELS[1])
  const [count, setCount] = useState('5')
  const [inputError, setInputError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    const parsedCount = Number.parseInt(count, 10)

    if (!Number.isFinite(parsedCount) || parsedCount < 1 || parsedCount > 20) {
      setInputError('Enter a number from 1 to 20.')
      return
    }

    setInputError('')
    onSubmit({ skill, difficulty, count: parsedCount })
  }

  return (
    <form className="saas-card h-fit p-5 sm:p-6" onSubmit={handleSubmit}>
      <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold text-gray-900">
        <SlidersHorizontal size={17} className="text-indigo-600" />
        Generation Setup
      </h2>

      <div className="space-y-4">
        <label className="field-group">
          <span className="field-label">Skill</span>
          <select className="field-control" value={skill} onChange={(event) => setSkill(event.target.value)}>
            {SKILLS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <div className="field-group">
          <span className="field-label">Difficulty</span>
          <div className="grid grid-cols-3 gap-2">
            {DIFFICULTY_LEVELS.map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setDifficulty(level)}
                className={difficulty === level ? 'pill-btn-active' : 'pill-btn'}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <label className="field-group">
          <span className="field-label">Number of Questions</span>
          <input
            className="field-control"
            type="number"
            min="1"
            max="20"
            value={count}
            onChange={(event) => setCount(event.target.value)}
            placeholder="e.g. 5"
          />
        </label>
      </div>

      {inputError ? <p className="mt-3 text-xs font-medium text-red-600">{inputError}</p> : null}

      <button className="primary-btn mt-5" type="submit" disabled={isLoading}>
        <Layers3 size={16} />
        {isLoading ? 'Generating...' : 'Generate Questions'}
      </button>
    </form>
  )
}

export { InterviewForm }
