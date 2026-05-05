import { useAuth } from "../context/AuthContext"

export default function Home({ setPage }) {
  const { addToCart } = useAuth()

  const courses = [
    { emoji: "⚛", title: "React & Next.js", category: "Développement Web", price: "2500 DA", duration: "20h" },
    { emoji: "🎨", title: "Design UX/UI", category: "Design", price: "1800 DA", duration: "15h" },
    { emoji: "🐍", title: "Python Data Science", category: "Data & IA", price: "3000 DA", duration: "25h" },
    { emoji: "📱", title: "Flutter Mobile", category: "Dev Mobile", price: "2800 DA", duration: "22h" },
    { emoji: "⚙️", title: "Structure Machine 1", category: "Cours Universitaires", price: "800 DA", duration: "30h" },
    { emoji: "🌐", title: "Réseau & Base de Données", category: "Cours Universitaires", price: "900 DA", duration: "35h" },
    { emoji: "☁️", title: "Introduction au Cloud", category: "Cours Universitaires", price: "700 DA", duration: "12h" },
  ]

  return (
    <div>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 to-blue-500 py-24 px-6 text-center">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] bg-gradient-to-b from-blue-400/30 to-transparent blur-3xl rounded-full"></div>
          <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] bg-gradient-to-t from-blue-800/30 to-transparent blur-3xl rounded-full"></div>
        </div>

        <div className="relative max-w-4xl mx-auto z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-sm font-medium px-4 py-2 rounded-full mb-8 shadow-sm backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-100 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
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
            <button
              onClick={() => setPage("courses")}
              className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition"
            >
              Explorer les cours
            </button>
            <button
              onClick={() => setPage("register")}
              className="px-8 py-3 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition"
            >
              Commencer gratuitement
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-3 gap-6 mb-16">
          {[
            { icon: "📚", value: "500+", label: "Cours disponibles" },
            { icon: "👨‍🏫", value: "120", label: "Formateurs experts" },
            { icon: "👥", value: "5000+", label: "Étudiants actifs" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl border border-slate-200 p-8 text-center"
            >
              <div className="text-4xl mb-3">{stat.icon}</div>
              <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
              <div className="text-slate-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Cours populaires */}
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          Cours populaires
        </h2>
        <div className="grid grid-cols-4 gap-5 md:grid-cols-2">
          {courses.map((course) => (
            <div
              key={course.title}
              className="bg-white rounded-2xl border border-slate-200 p-5 hover:-translate-y-1 transition-transform flex flex-col"
            >
              <div className="h-28 rounded-xl bg-blue-50 flex items-center justify-center text-4xl mb-4">
                {course.emoji}
              </div>
              <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full w-fit">
                {course.category}
              </span>
              <h3 className="font-bold text-slate-900 mt-3 mb-1">{course.title}</h3>
              <div className="text-xs text-slate-400 mb-4">⏱ {course.duration}</div>
              <div className="flex justify-between items-center mt-auto">
                <span className="font-bold text-blue-600">{course.price}</span>
                <button
                  onClick={() => addToCart(course)}
                  className="text-xs px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  + Panier
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <button
            onClick={() => setPage("courses")}
            className="px-8 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition"
          >
            Voir tous les cours →
          </button>
        </div>
      </div>
    </div>
  )
}