export default function Home({ setPage }) {
  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-700 to-blue-500 text-white py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block bg-white/20 text-sm px-4 py-1 rounded-full mb-6">
            ✨ La plateforme d'apprentissage algérienne
          </span>
          <h1 className="text-5xl font-extrabold mb-4 leading-tight">
            Apprenez. Enseignez. <span className="text-blue-200">Évoluez.</span>
          </h1>
          <p className="text-lg opacity-90 mb-8">
            Connectez-vous avec les meilleurs formateurs algériens pour
            accélérer votre carrière professionnelle.
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
          {[
            { emoji: "⚛", title: "React & Next.js", category: "Développement Web", price: "2500 DA" },
            { emoji: "🎨", title: "Design UX/UI", category: "Design", price: "1800 DA" },
            { emoji: "🐍", title: "Python Data Science", category: "Data & IA", price: "3000 DA" },
            { emoji: "📱", title: "Flutter Mobile", category: "Dev Mobile", price: "2800 DA" },
            { emoji: "⚙️", title: "Structure Machine 1", category: "Cours Universitaires", price: "Gratuit" },
            { emoji: "🌐", title: "Réseau & Base de Données", category: "Cours Universitaires", price: "Gratuit" },
            { emoji: "☁️", title: "Introduction au Cloud", category: "Cours Universitaires", price: "Gratuit" },
          ].map((course) => (
            <div
              key={course.title}
              onClick={() => setPage("courses")}
              className="bg-white rounded-2xl border border-slate-200 p-5 cursor-pointer hover:-translate-y-1 transition-transform"
            >
              <div className="h-28 rounded-xl bg-blue-50 flex items-center justify-center text-4xl mb-4">
                {course.emoji}
              </div>
              <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                {course.category}
              </span>
              <h3 className="font-bold text-slate-900 mt-3 mb-4">{course.title}</h3>
              <div className="flex justify-between items-center">
                <span className="font-bold text-blue-600">{course.price}</span>
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