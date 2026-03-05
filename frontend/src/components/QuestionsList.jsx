import { QuestionCard } from './QuestionCard'

const QuestionsList = ({ questions }) => {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      {questions.map((item, index) => (
        <QuestionCard key={`${item?.question || 'question'}-${index}`} item={item} index={index} />
      ))}
    </section>
  )
}

export { QuestionsList }
