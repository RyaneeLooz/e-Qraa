import { useState, useMemo } from "react"
import { useAuth } from "../context/AuthContext"
import Filters from "../components/Filters"
import CourseTable from "../components/CourseTable"

// Données de test
const MOCK_COURSES = [
  { id: 1, emoji: "💻", title: "React pour les débutants", category: "Développement Web", duration: "10h", price: "2490 Coins", status: "Actif", date: "2023-10-01", instructor: "Sarah Kadi" },
  { id: 2, emoji: "🎨", title: "Maîtriser Figma", category: "Design", duration: "8h", price: "1990 Coins", status: "Actif", date: "2023-11-15", instructor: "Lina Dahmani" },
  { id: 3, emoji: "📊", title: "Python pour la Data Science", category: "Data & IA", duration: "25h", price: "2990 Coins", status: "Terminé", date: "2023-09-20", instructor: "Karim Ziani" },
  { id: 4, emoji: "📱", title: "Développement Flutter", category: "Dev Mobile", duration: "30h", price: "2790 Coins", status: "Actif", date: "2023-12-05", instructor: "Sarah Kadi" },
  { id: 5, emoji: "🤖", title: "Introduction au Machine Learning", category: "Data & IA", duration: "15h", price: "2190 Coins", status: "Actif", date: "2024-01-10", instructor: "Karim Ziani" },
  { id: 6, emoji: "🎓", title: "Structure Machine 1", category: "Cours Universitaires", duration: "30h", price: "Gratuit", status: "Actif", date: "2024-02-01", instructor: "Dr. Amine Benali" },
  { id: 7, emoji: "🎓", title: "Réseau & Base de Données", category: "Cours Universitaires", duration: "35h", price: "Gratuit", status: "Actif", date: "2024-02-15", instructor: "Prof. Yassine Merabti" },
  { id: 8, emoji: "🎓", title: "Introduction au Cloud", category: "Cours Universitaires", duration: "12h", price: "Gratuit", status: "Terminé", date: "2023-10-10", instructor: "Dr. Fatima Lounes" },
  { id: 9, emoji: "🌐", title: "Node.js et Express", category: "Développement Web", duration: "20h", price: "2390 Coins", status: "Actif", date: "2024-03-05", instructor: "Sarah Kadi" },
  { id: 10, emoji: "📱", title: "iOS avec Swift", category: "Dev Mobile", duration: "40h", price: "3490 Coins", status: "Actif", date: "2024-04-20", instructor: "Sarah Kadi" },
]

const CATEGORIES = [
  "Développement Web",
  "Design",
  "Data & IA",
  "Dev Mobile",
  "Cours Universitaires"
]

export default function Courses({ initialFilter }) {
  const { addToCart } = useAuth()
  
  const [filters, setFilters] = useState({
    search: initialFilter || "",
    category: "",
    status: "",
    date: ""
  })

  // Filtrage des cours
  const filteredCourses = useMemo(() => {
    return MOCK_COURSES.filter((course) => {
      const matchSearch = 
        course.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        course.instructor.toLowerCase().includes(filters.search.toLowerCase())
      
      const matchCategory = filters.category ? course.category === filters.category : true
      const matchStatus = filters.status ? course.status === filters.status : true
      const matchDate = filters.date ? new Date(course.date) >= new Date(filters.date) : true
      
      return matchSearch && matchCategory && matchStatus && matchDate
    })
  }, [filters])

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Catalogue des cours</h1>
        <p className="text-slate-600">
          Explorez notre sélection de formations et de cours universitaires.
        </p>
      </div>

      <Filters 
        filters={filters} 
        setFilters={setFilters} 
        categories={CATEGORIES} 
      />

      <CourseTable 
        courses={filteredCourses} 
        onAddToCart={addToCart} 
      />
    </div>
  )
}
