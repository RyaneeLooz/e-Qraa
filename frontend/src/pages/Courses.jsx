import { useState, useMemo } from "react"
import { useAuth } from "../context/AuthContext"
import Filters from "../components/Filters"
import CourseTable from "../components/CourseTable"

// Données de test
const MOCK_COURSES = [
  { id: 1, emoji: "💻", title: "React pour les débutants", category: "Développement Web", duration: "10h", price: "2500 DA", status: "Actif", date: "2023-10-01" },
  { id: 2, emoji: "🎨", title: "Maîtriser Figma", category: "Design", duration: "8h", price: "2000 DA", status: "Actif", date: "2023-11-15" },
  { id: 3, emoji: "📊", title: "Python pour la Data Science", category: "Data & IA", duration: "25h", price: "3000 DA", status: "Terminé", date: "2023-09-20" },
  { id: 4, emoji: "📱", title: "Développement Flutter", category: "Dev Mobile", duration: "30h", price: "2800 DA", status: "Actif", date: "2023-12-05" },
  { id: 5, emoji: "🤖", title: "Introduction au Machine Learning", category: "Data & IA", duration: "15h", price: "2200 DA", status: "Actif", date: "2024-01-10" },
  { id: 6, emoji: "🎓", title: "Structure Machine 1", category: "Cours Universitaires", duration: "30h", price: "800 DA", status: "Actif", date: "2024-02-01" },
  { id: 7, emoji: "🎓", title: "Réseau & Base de Données", category: "Cours Universitaires", duration: "35h", price: "900 DA", status: "Actif", date: "2024-02-15" },
  { id: 8, emoji: "🎓", title: "Introduction au Cloud", category: "Cours Universitaires", duration: "12h", price: "700 DA", status: "Terminé", date: "2023-10-10" },
  { id: 9, emoji: "🌐", title: "Node.js et Express", category: "Développement Web", duration: "20h", price: "2400 DA", status: "Actif", date: "2024-03-05" },
  { id: 10, emoji: "📱", title: "iOS avec Swift", category: "Dev Mobile", duration: "40h", price: "3500 DA", status: "Actif", date: "2024-04-20" },
]

const CATEGORIES = [
  "Développement Web",
  "Design",
  "Data & IA",
  "Dev Mobile",
  "Cours Universitaires"
]

export default function Courses() {
  const { addToCart } = useAuth()
  
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    status: "",
    date: ""
  })

  // Filtrage des cours
  const filteredCourses = useMemo(() => {
    return MOCK_COURSES.filter((course) => {
      const matchSearch = course.title.toLowerCase().includes(filters.search.toLowerCase())
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
