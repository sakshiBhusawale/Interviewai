import { Sparkles } from 'lucide-react'

const EmptyState = () => {
  return (
    <section className="saas-card p-10 text-center">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
        <Sparkles size={18} />
      </div>
      <h2 className="mt-4 text-xl font-semibold text-gray-900">Ready to generate</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm text-gray-600">
        Choose skill, difficulty, and question count to create your interview question set.
      </p>
    </section>
  )
}

export { EmptyState }
