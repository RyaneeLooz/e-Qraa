export default function Filters({ filters, setFilters, categories }) {
  const handleChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 space-y-4 md:space-y-0 md:flex md:gap-4 md:items-end">
      {/* Recherche par mot-clé */}
      <div className="flex-1">
        <label htmlFor="search" className="block text-sm font-medium text-slate-700 mb-1">
          Recherche
        </label>
        <input
          type="text"
          id="search"
          name="search"
          value={filters.search}
          onChange={handleChange}
          placeholder="Mot-clé..."
          className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-colors"
        />
      </div>

      {/* Catégorie */}
      <div className="w-full md:w-48">
        <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">
          Catégorie
        </label>
        <select
          id="category"
          name="category"
          value={filters.category}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-colors bg-white"
        >
          <option value="">Toutes</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Statut */}
      <div className="w-full md:w-40">
        <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-1">
          Statut
        </label>
        <select
          id="status"
          name="status"
          value={filters.status}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-colors bg-white"
        >
          <option value="">Tous</option>
          <option value="Actif">Actif</option>
          <option value="Terminé">Terminé</option>
        </select>
      </div>

      {/* Date */}
      <div className="w-full md:w-48">
        <label htmlFor="date" className="block text-sm font-medium text-slate-700 mb-1">
          Date (à partir de)
        </label>
        <input
          type="date"
          id="date"
          name="date"
          value={filters.date}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-colors text-slate-700"
        />
      </div>

      {/* Bouton réinitialiser */}
      <div>
        <button
          onClick={() => setFilters({ search: "", category: "", status: "", date: "" })}
          className="w-full md:w-auto px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
        >
          Réinitialiser
        </button>
      </div>
    </div>
  )
}
