const Loader = () => {
  return (
    <section className="saas-card p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-3 text-gray-700">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
        <p className="text-sm font-semibold">Generating interview set...</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="skeleton h-36 rounded-xl" />
        <div className="skeleton h-36 rounded-xl" />
      </div>
    </section>
  )
}

export { Loader }
