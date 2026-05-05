const MOCK_INSTRUCTORS = [
  {
    id: 1,
    name: "Dr. Amine Benali",
    specialty: "Informatique / Structure Machine",
    university: "USTHB",
    rating: 4.9,
    students: 1250,
    courses: 4,
    avatar: "👨‍🏫",
    recentReview: "Meilleur prof ! Ses explications sur les pointeurs sont très claires."
  },
  {
    id: 2,
    name: "Sarah Kadi",
    specialty: "Développement Web & React",
    university: "ESI Alger",
    rating: 4.8,
    students: 3400,
    courses: 6,
    avatar: "👩‍💻",
    recentReview: "Grâce à elle, j'ai trouvé mon premier stage en React."
  },
  {
    id: 3,
    name: "Prof. Yassine Merabti",
    specialty: "Réseaux & Télécoms",
    university: "Université d'Oran",
    rating: 4.7,
    students: 890,
    courses: 3,
    avatar: "👨‍🔬",
    recentReview: "Les TP de réseaux sont excellents et très pratiques."
  },
  {
    id: 4,
    name: "Lina Dahmani",
    specialty: "UI/UX Design",
    university: "École des Beaux-Arts",
    rating: 4.9,
    students: 4120,
    courses: 5,
    avatar: "🎨",
    recentReview: "Sa formation Figma m'a fait gagner un temps fou !"
  },
  {
    id: 5,
    name: "Karim Ziani",
    specialty: "Data Science & Python",
    university: "Autodidacte / Expert",
    rating: 4.6,
    students: 2100,
    courses: 2,
    avatar: "📊",
    recentReview: "Très bon pédagogue pour démarrer le Machine Learning."
  },
  {
    id: 6,
    name: "Dr. Fatima Lounes",
    specialty: "Bases de données",
    university: "Université d'Alger 1",
    rating: 4.8,
    students: 1650,
    courses: 3,
    avatar: "👩‍🏫",
    recentReview: "J'ai enfin compris SQL grâce à ses cours."
  }
]

export default function Instructors({ setPage }) {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Nos Formateurs d'Élite</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Apprenez avec les meilleurs professeurs universitaires et experts algériens. 
          Découvrez leurs parcours et rejoignez leurs cours.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {MOCK_INSTRUCTORS.map((instructor) => (
          <div key={instructor.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-24 bg-gradient-to-r from-blue-500 to-blue-700"></div>
            <div className="px-6 pb-6 relative">
              {/* Avatar flottant */}
              <div className="w-20 h-20 bg-white rounded-full border-4 border-white shadow-md flex items-center justify-center text-4xl absolute -top-10 left-6 z-10">
                {instructor.avatar}
              </div>
              
              <div className="pt-14">
                <h3 className="text-xl font-bold text-slate-900">{instructor.name}</h3>
                <p className="text-blue-600 font-medium text-sm">{instructor.specialty}</p>
                <p className="text-slate-500 text-sm mt-1 flex items-center gap-1">
                  🏛 {instructor.university}
                </p>
              </div>



              <div className="flex justify-between items-center mt-5 pt-5 border-t border-slate-100">
                <div className="text-center">
                  <div className="font-bold text-slate-900 flex items-center gap-1">
                    ⭐ {instructor.rating}
                  </div>
                  <div className="text-xs text-slate-500">Note</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-slate-900">{instructor.students}</div>
                  <div className="text-xs text-slate-500">Élèves</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-slate-900">{instructor.courses}</div>
                  <div className="text-xs text-slate-500">Cours</div>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <button 
                  onClick={() => alert(`Évaluer ${instructor.name} : La note sera publique, mais votre commentaire sera strictement privé (visible uniquement par le formateur et l'administration).`)}
                  className="w-1/3 py-2 bg-yellow-50 text-yellow-600 rounded-xl font-bold text-sm hover:bg-yellow-100 transition-colors"
                >
                  ⭐ Évaluer
                </button>
                <button 
                  onClick={() => setPage("courses")}
                  className="w-2/3 py-2 border border-blue-600 text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-colors text-sm"
                >
                  Voir ses cours
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 bg-blue-50 rounded-3xl p-8 md:p-12 text-center border border-blue-100">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Vous souhaitez enseigner sur e-Qraa ?</h2>
        <p className="text-slate-600 max-w-2xl mx-auto mb-8">
          Rejoignez notre communauté de formateurs, partagez votre savoir et générez des revenus.
          Nous ne prenons que 20% de commission !
        </p>
        <button 
          onClick={() => setPage("register")}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-sm"
        >
          Devenir formateur
        </button>
      </div>
    </div>
  )
}
