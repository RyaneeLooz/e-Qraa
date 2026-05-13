import { useState, useMemo, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { coursesAPI } from "../services/api"
import { useGlobalToast } from "../App"
import Filters from "../components/Filters"
import CourseTable from "../components/CourseTable"
import Spinner from "../components/Spinner"

const CATEGORIES = [
  "Développement Web",
  "Design",
  "Data & IA",
  "Dev Mobile",
  "Cours Universitaires",
]

export default function Courses() {
  const { addToCart } = useAuth()
  const toast = useGlobalToast()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [allCourses, setAllCourses] = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)
  const [filters, setFilters]       = useState({
    search:   searchParams.get("q") || "",
    category: "",
    status:   "",
    date:     "",
  })

  // ── Charger les cours depuis l'API ──────────────────────────
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await coursesAPI.getAll()
        setAllCourses(data)
      } catch (err) {
        setError(err.message)
        // Fallback vers les données mock
        setAllCourses(MOCK_COURSES)
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [])

  // ── Mettre à jour le filtre de recherche si l'URL change ───
  useEffect(() => {
    const q = searchParams.get("q")
    if (q) setFilters((prev) => ({ ...prev, search: q }))
  }, [searchParams])

  // ── Filtrage côté client ────────────────────────────────────
  const filteredCourses = useMemo(() => {
    return allCourses.filter((course) => {
      const instructorName = course.instructor_name ?? course.instructor ?? ""
      const matchSearch =
        course.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        instructorName.toLowerCase().includes(filters.search.toLowerCase())

      const matchCategory = filters.category ? course.category === filters.category : true
      const matchDate     = filters.date ? new Date(course.created_at ?? course.date) >= new Date(filters.date) : true

      return matchSearch && matchCategory && matchDate
    })
  }, [allCourses, filters])

  const handleAddToCart = (course) => {
    addToCart(course)
    toast.success(`"${course.title}" ajouté au panier !`)
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Catalogue des cours</h1>
        <p className="text-slate-600">
          Explorez notre sélection de formations et de cours universitaires.
          {!loading && (
            <span className="ml-2 text-blue-600 font-medium">
              {filteredCourses.length} cours trouvés
            </span>
          )}
        </p>
      </div>

      {/* Bannière d'erreur (backend hors-ligne) */}
      {error && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-center gap-3">
          <span className="text-yellow-600 text-xl">⚠️</span>
          <p className="text-sm text-yellow-800">
            <strong>Backend non disponible.</strong> Affichage des données de démonstration.
          </p>
        </div>
      )}

      <Filters filters={filters} setFilters={setFilters} categories={CATEGORIES} />

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="text-slate-500 mt-4">Chargement des cours...</p>
          </div>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Aucun cours trouvé</h3>
          <p className="text-slate-500">Essayez de modifier vos filtres de recherche.</p>
        </div>
      ) : (
        <CourseTable
          courses={filteredCourses}
          onAddToCart={handleAddToCart}
          onViewDetail={(course) => course.id && navigate(`/courses/${course.id}`)}
        />
      )}
    </div>
  )
}

// ── Données mock de fallback ────────────────────────────────
const MOCK_COURSES = [
  { id: 1, emoji: "💻", title: "React pour les débutants", category: "Développement Web", price: 2490, instructor_name: "Sarah Kadi", created_at: "2023-10-01" },
  { id: 2, emoji: "🎨", title: "Maîtriser Figma", category: "Design", price: 1990, instructor_name: "Lina Dahmani", created_at: "2023-11-15" },
  { id: 3, emoji: "📊", title: "Python pour la Data Science", category: "Data & IA", price: 2990, instructor_name: "Karim Ziani", created_at: "2023-09-20" },
  { id: 4, emoji: "📱", title: "Développement Flutter", category: "Dev Mobile", price: 2790, instructor_name: "Sarah Kadi", created_at: "2023-12-05" },
  { id: 5, emoji: "🤖", title: "Introduction au Machine Learning", category: "Data & IA", price: 2190, instructor_name: "Karim Ziani", created_at: "2024-01-10" },
  { id: 6, emoji: "🎓", title: "Structure Machine 1", category: "Cours Universitaires", price: 0, instructor_name: "Dr. Amine Benali", created_at: "2024-02-01" },
  { id: 7, emoji: "🎓", title: "Réseau & Base de Données", category: "Cours Universitaires", price: 0, instructor_name: "Prof. Yassine Merabti", created_at: "2024-02-15" },
  { id: 8, emoji: "🎓", title: "Introduction au Cloud", category: "Cours Universitaires", price: 0, instructor_name: "Dr. Fatima Lounes", created_at: "2023-10-10" },
  { id: 9, emoji: "🌐", title: "Node.js et Express", category: "Développement Web", price: 2390, instructor_name: "Sarah Kadi", created_at: "2024-03-05" },
  { id: 10, emoji: "📱", title: "iOS avec Swift", category: "Dev Mobile", price: 3490, instructor_name: "Sarah Kadi", created_at: "2024-04-20" },
]
