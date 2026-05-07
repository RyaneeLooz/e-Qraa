import { useState, useMemo } from "react"

export default function CourseTable({ courses, onAddToCart }) {
  const [sortConfig, setSortConfig] = useState({ key: "title", direction: "asc" })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const handleSort = (key) => {
    let direction = "asc"
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  const sortedCourses = useMemo(() => {
    const sortableCourses = [...courses]
    sortableCourses.sort((a, b) => {
      let aValue = a[sortConfig.key]
      let bValue = b[sortConfig.key]

      // Handle price sorting (remove non-digits and convert to number)
      if (sortConfig.key === "price") {
        aValue = parseInt(aValue.toString().replace(/\D/g, "")) || 0
        bValue = parseInt(bValue.toString().replace(/\D/g, "")) || 0
      }

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1
      }
      return 0
    })
    return sortableCourses
  }, [courses, sortConfig])

  // Pagination
  const totalPages = Math.ceil(sortedCourses.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedCourses = sortedCourses.slice(startIndex, startIndex + itemsPerPage)

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return <span className="text-slate-300 ml-1">↕</span>
    return <span className="text-blue-600 ml-1">{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
  }

  if (courses.length === 0) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center text-slate-500">
        Aucun cours ne correspond à vos critères.
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-sm text-slate-600">
              <th 
                className="p-4 font-semibold cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => handleSort("title")}
              >
                Titre <SortIcon columnKey="title" />
              </th>
              <th 
                className="p-4 font-semibold cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => handleSort("category")}
              >
                Catégorie <SortIcon columnKey="category" />
              </th>
              <th 
                className="p-4 font-semibold cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => handleSort("duration")}
              >
                Durée <SortIcon columnKey="duration" />
              </th>
              <th 
                className="p-4 font-semibold cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => handleSort("status")}
              >
                Statut <SortIcon columnKey="status" />
              </th>
              <th 
                className="p-4 font-semibold cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => handleSort("price")}
              >
                Prix <SortIcon columnKey="price" />
              </th>
              <th className="p-4 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedCourses.map((course, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{course.emoji}</span>
                    <span className="font-medium text-slate-900">{course.title}</span>
                  </div>
                </td>
                <td className="p-4 text-sm text-slate-600">
                  <span className="inline-block px-2 py-1 bg-slate-100 rounded-lg">
                    {course.category}
                  </span>
                </td>
                <td className="p-4 text-sm text-slate-600">{course.duration}</td>
                <td className="p-4 text-sm">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    course.status === "Actif" 
                      ? "bg-green-100 text-green-700" 
                      : "bg-slate-100 text-slate-700"
                  }`}>
                    {course.status}
                  </span>
                </td>
                <td className={`p-4 font-bold ${course.price === "Gratuit" ? "text-green-600" : "text-yellow-600"}`}>
                  {course.price}
                </td>
                <td className="p-4">
                  <button
                    onClick={() => onAddToCart(course)}
                    className="px-3 py-1.5 text-sm font-medium border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap"
                  >
                    + Panier
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-slate-200 flex items-center justify-between">
          <p className="text-sm text-slate-600">
            Affichage de <span className="font-medium">{startIndex + 1}</span> à <span className="font-medium">{Math.min(startIndex + itemsPerPage, sortedCourses.length)}</span> sur <span className="font-medium">{sortedCourses.length}</span> résultats
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Précédent
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Suivant
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
