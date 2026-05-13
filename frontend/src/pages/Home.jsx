import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { coursesAPI } from "../services/api"
import { CourseCardSkeleton, StatSkeleton } from "../components/Spinner"
import { useGlobalToast } from "../App"

export default function Home() {
  const { addToCart } = useAuth()
  const toast = useGlobalToast()
  const navigate = useNavigate()

  const [courses, setCourses]     = useState([])
  const [loading, setLoading]     = useState(true)
  const [stats, setStats]         = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await coursesAPI.getAll()
        // Afficher seulement les 7 premiers cours populaires
        setCourses(data.slice(0, 7))
        // Stats dynamiques depuis les données
        setStats({
          courses:     data.length,
          instructors: [...new Set(data.map(c => c.instructor_id))].length,
          students:    "5000+", // Sera dynamique avec l'API admin-stats
        })
      } catch {
        // En cas d'erreur réseau → afficher des données de démo
        setCourses(DEMO_COURSES)
        setStats({ courses: "500+", instructors: 120, students: "5000+" })
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleAddToCart = (course) => {
    addToCart(course)
    toast.success(`"${course.title}" ajouté au panier !`)
  }

  const formatPrice = (course) => {
    if (course.price === 0 || course.price === "Gratuit") return "Gratuit"
    if (typeof course.price === "number") return `${course.price} Coins`
    return course.price
  }

  const isGratuit = (course) => course.price === 0 || course.price === "Gratuit"

  return (
    <div>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 to-blue-500 py-24 px-6 text-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] bg-gradient-to-b from-blue-400/30 to-transparent blur-3xl rounded-full" />
          <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] bg-gradient-to-t from-blue-800/30 to-transparent blur-3xl rounded-full" />
        </div>

        <div className="relative max-w-4xl mx-auto z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-sm font-medium px-4 py-2 rounded-full mb-8 shadow-sm backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-100 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
            </span>
            Nouvelle méthode d'apprentissage
          </div>

          <h2 className="text-2xl md:text-3xl font-medium mb-3 text-blue-100 tracking-wide">
            Propulsez votre carrière avec
          </h2>
          <h1 className="text-7xl md:text-8xl lg:text-9xl font-black mb-8 leading-none tracking-tighter text-white drop-shadow-lg">
            e-Qraa
          </h1>

          <p className="text-lg md:text-xl text-blue-50 mb-10 max-w-2xl mx-auto leading-relaxed">
            Rejoignez l'élite. Formez-vous avec les meilleurs experts universitaires et professionnels, gagnez des Coins et montez dans le classement.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/courses" className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition">
              Explorer les cours
            </Link>
            <Link to="/register" className="px-8 py-3 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition">
              Commencer gratuitement
            </Link>
          </div>
        </div>
      </div>

      {/* ── Stats ─────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-3 gap-6 mb-16">
          {loading ? (
            [1, 2, 3].map((i) => <StatSkeleton key={i} />)
          ) : (
            [
              { icon: "📚", value: stats?.courses ?? "500+", label: "Cours disponibles" },
              { icon: "👨‍🏫", value: stats?.instructors ?? "120", label: "Formateurs experts" },
              { icon: "👥", value: stats?.students ?? "5000+", label: "Étudiants actifs" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
                <div className="text-4xl mb-3">{stat.icon}</div>
                <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-slate-500 mt-1">{stat.label}</div>
              </div>
            ))
          )}
        </div>

        {/* ── Cours populaires ──────────────────────────────── */}
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Cours populaires</h2>
        <div className="grid grid-cols-4 gap-5 md:grid-cols-2">
          {loading
            ? [1, 2, 3, 4].map((i) => <CourseCardSkeleton key={i} />)
            : courses.map((course) => (
                <div
                  key={course.id ?? course.title}
                  className="bg-white rounded-2xl border border-slate-200 p-5 hover:-translate-y-1 transition-transform flex flex-col cursor-pointer group"
                  onClick={() => course.id && navigate(`/courses/${course.id}`)}
                >
                  <div className="h-28 rounded-xl bg-blue-50 flex items-center justify-center text-4xl mb-4 overflow-hidden">
                    {course.thumbnail_url
                      ? <img src={`http://localhost:5000${course.thumbnail_url}`} alt={course.title} className="h-full w-full object-cover rounded-xl" />
                      : <span>{course.emoji ?? "📚"}</span>
                    }
                  </div>
                  <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full w-fit">
                    {course.category}
                  </span>
                  <h3 className="font-bold text-slate-900 mt-3 mb-1 group-hover:text-blue-600 transition-colors">
                    {course.title}
                  </h3>
                  <div className="text-xs text-slate-400 mb-4">
                    👨‍🏫 {course.instructor_name ?? course.instructor}
                  </div>
                  <div className="flex justify-between items-center mt-auto">
                    <span className={`font-bold ${isGratuit(course) ? "text-green-600" : "text-yellow-600"}`}>
                      {formatPrice(course)}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleAddToCart(course) }}
                      className="text-xs px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      + Panier
                    </button>
                  </div>
                </div>
              ))
          }
        </div>

        <div className="text-center mt-10">
          <Link
            to="/courses"
            className="px-8 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition"
          >
            Voir tous les cours →
          </Link>
        </div>
      </div>
    </div>
  )
}

// ── Données de démo (fallback si backend hors ligne) ──────────
const DEMO_COURSES = [
  { id: null, emoji: "⚛", title: "React & Next.js", category: "Développement Web", price: 2490, instructor_name: "Sarah Kadi" },
  { id: null, emoji: "🎨", title: "Design UX/UI", category: "Design", price: 1790, instructor_name: "Lina Dahmani" },
  { id: null, emoji: "🐍", title: "Python Data Science", category: "Data & IA", price: 2990, instructor_name: "Karim Ziani" },
  { id: null, emoji: "📱", title: "Flutter Mobile", category: "Dev Mobile", price: 2790, instructor_name: "Sarah Kadi" },
  { id: null, emoji: "⚙️", title: "Structure Machine 1", category: "Cours Universitaires", price: 0, instructor_name: "Dr. Benali" },
  { id: null, emoji: "🌐", title: "Réseau & Bases de Données", category: "Cours Universitaires", price: 0, instructor_name: "Prof. Merabti" },
  { id: null, emoji: "☁️", title: "Introduction au Cloud", category: "Cours Universitaires", price: 0, instructor_name: "Dr. Lounes" },
]