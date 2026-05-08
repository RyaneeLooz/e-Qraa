import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import CourseForm from "../components/CourseForm"

// --- VUE ÉTUDIANT ---
function StudentDashboard({ user }) {
  const { coins } = useAuth()
  const [showPacks, setShowPacks] = useState(false)
  const [courses] = useState([
    { id: 1, title: "React pour les débutants", progress: "80%" },
    { id: 2, title: "Structure Machine 1", progress: "100%" }
  ])

  // Mock du classement Gamification
  const leaderboard = [
    { rank: 1, name: "Yanis B.", points: 3450, isMe: false },
    { rank: 2, name: "Sara K.", points: 3200, isMe: false },
    { rank: 3, name: user.name, points: 2950, isMe: true }, // L'utilisateur
    { rank: 4, name: "Ayoub D.", points: 2800, isMe: false },
    { rank: 5, name: "Lina M.", points: 2100, isMe: false },
  ]

  const coinPacks = [
    { coins: 1490, price: "1200 DA", label: "Pack Découverte" },
    { coins: 3990, price: "2900 DA", bonus: "Plus Populaire", label: "+990 offerts" },
    { coins: 9990, price: "6500 DA", bonus: "Meilleure Valeur", label: "+3490 offerts" },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
          <div className="text-slate-500 mb-1 text-sm font-medium">Mon Solde</div>
          <div className="flex items-center gap-3 text-3xl font-bold text-yellow-500 mb-8 mt-2">
            <span className="drop-shadow-sm">🟡</span>
            <span>{coins}</span>
          </div>
          <button 
            onClick={() => setShowPacks(!showPacks)}
            className="mt-auto pt-4 w-full py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-medium transition-colors"
          >
            Recharger mes Coins
          </button>
        </div>

        {/* Gamification Summary */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-2xl shadow-sm text-white">
          <div className="opacity-80 mb-1 text-sm font-medium">USTHB - Info</div>
          <div className="text-3xl font-bold flex items-center gap-2">
            🏆 3ème <span className="text-lg font-normal opacity-80">/ 450</span>
          </div>
          <p className="mt-4 text-sm text-blue-100">
            Encore 251 points pour passer 2ème !
          </p>
        </div>

        {/* Historique */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="text-slate-500 mb-1">Mes Inscriptions</div>
          <div className="text-3xl font-bold text-slate-900">{courses.length}</div>
          <p className="mt-4 text-sm text-slate-600">
            Cours en cours ou terminés.
          </p>
        </div>
      </div>

      {/* Packs de Coins & Codes */}
      {showPacks && (
        <div className="bg-yellow-50 p-6 rounded-2xl border border-yellow-200">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Recharger mes e-Qraa Coins</h3>
              <p className="text-sm text-slate-600 mt-1">Solde crédité instantanément, 24h/24 et 7j/7.</p>
            </div>
            
            {/* Option 1 : Carte Prépayée */}
            <div className="w-full lg:w-auto bg-white p-3 rounded-xl border border-yellow-300 shadow-sm">
              <div className="text-xs font-bold text-slate-500 uppercase mb-2">Option 1 : Carte Prépayée e-Qraa</div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Code secret (ex: QRAA-8X9P...)" 
                  className="w-full sm:w-64 px-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <button 
                  onClick={() => alert("Code valide ! Vos Coins ont été ajoutés instantanément.")}
                  className="px-4 py-2 bg-slate-900 text-white font-bold text-sm rounded-lg hover:bg-slate-800 whitespace-nowrap transition-colors"
                >
                  Activer
                </button>
              </div>
            </div>
          </div>
          
          {/* Option 2 : Edahabia / CIB */}
          <div className="text-xs font-bold text-slate-500 uppercase mb-3">Option 2 : Paiement par carte Edahabia / CIB</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {coinPacks.map((pack, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-yellow-100 flex items-center justify-between hover:border-yellow-400 cursor-pointer transition-colors relative group">
                {pack.bonus && (
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                    {pack.bonus}
                  </span>
                )}
                <div>
                  <div className="font-bold text-lg text-yellow-500">{pack.coins} 🟡</div>
                  <div className="text-sm font-bold text-slate-900">{pack.price}</div>
                  <div className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">{pack.label}</div>
                </div>
                <button 
                  onClick={() => {
                    alert(`Redirection vers la passerelle sécurisée (Chargily) pour ${pack.price}. Le solde sera ajouté instantanément.`)
                    setShowPacks(false)
                  }}
                  className="px-4 py-2 bg-yellow-50 text-yellow-600 font-bold text-sm rounded-lg group-hover:bg-yellow-500 group-hover:text-white transition-colors"
                >
                  Payer
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mes cours actuels */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 lg:col-span-2">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Mes cours actuels</h3>
          <div className="space-y-4">
            {courses.map(course => (
              <div key={course.id} className="p-4 border border-slate-100 rounded-xl flex justify-between items-center bg-slate-50">
                <span className="font-medium text-slate-800">{course.title}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-slate-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: course.progress }}></div>
                  </div>
                  <span className="text-sm font-bold text-slate-600">{course.progress}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Classement Détaillé */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-1">Classement</h3>
          <p className="text-xs text-slate-500 mb-4">Informatique - USTHB</p>
          <div className="space-y-3">
            {leaderboard.map((student) => (
              <div 
                key={student.rank} 
                className={`flex items-center justify-between p-3 rounded-xl border ${
                  student.isMe 
                    ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-600' 
                    : 'bg-white border-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`font-bold w-5 text-center ${
                    student.rank === 1 ? 'text-yellow-500' : 
                    student.rank === 2 ? 'text-slate-400' : 
                    student.rank === 3 ? 'text-orange-400' : 'text-slate-400'
                  }`}>
                    {student.rank}
                  </span>
                  <span className={`font-medium ${student.isMe ? 'text-blue-900' : 'text-slate-700'}`}>
                    {student.name} {student.isMe && "(Moi)"}
                  </span>
                </div>
                <span className="text-sm font-bold text-slate-600">{student.points} pts</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// --- VUE FORMATEUR ---
function InstructorDashboard({ user }) {
  const [showCourseForm, setShowCourseForm] = useState(false)
  const [myCourses] = useState([
    { id: 1, title: "Développement Flutter", sales: 120, revenue: 268800 } // Revenue en Coins après 20% commission
  ])

  if (showCourseForm) {
    return (
      <CourseForm 
        onSubmit={(data) => {
          console.log("Nouveau cours", data)
          setShowCourseForm(false)
        }} 
        onCancel={() => setShowCourseForm(false)} 
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="text-slate-500 mb-1">Revenus Nets (80%)</div>
          <div className="text-3xl font-bold text-green-600">268,800 Coins</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="text-slate-500 mb-1">Mes Cours</div>
          <div className="text-3xl font-bold text-slate-900">{myCourses.length}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="text-slate-500 mb-1">Avis d'étudiants</div>
          <div className="text-3xl font-bold text-yellow-500">24 nouveaux</div>
        </div>
      </div>
      
      {!user.isVerified && (
        <div className="bg-orange-50 border border-orange-200 p-6 rounded-2xl flex flex-col md:flex-row items-center gap-4 animate-pulse">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-2xl">
            ⏳
          </div>
          <div className="flex-1 text-center md:text-left">
            <h4 className="font-bold text-orange-800">Compte en cours de vérification</h4>
            <p className="text-sm text-orange-700">
              Nos administrateurs examinent vos documents. Vous pourrez publier vos cours et interagir avec les étudiants dès que votre profil sera validé (généralement sous 24h).
            </p>
          </div>
          <div className="text-xs font-bold bg-orange-200 text-orange-800 px-3 py-1 rounded-full uppercase">
            Statut: En attente
          </div>
        </div>
      )}

      {/* Mes Cours Actuels */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-900">Mes Cours publiés</h3>
          <button 
            onClick={() => user.isVerified ? setShowCourseForm(true) : alert("Votre compte doit être vérifié par un administrateur avant de pouvoir créer un cours.")}
            className={`px-4 py-2 text-white text-sm font-medium rounded-xl transition ${
              user.isVerified ? "bg-blue-600 hover:bg-blue-700" : "bg-slate-300 cursor-not-allowed"
            }`}
          >
            + Créer un cours
          </button>
        </div>
        
        <table className="w-full text-left">
          <thead>
            <tr className="text-sm text-slate-500 border-b border-slate-200">
              <th className="pb-3 font-medium">Titre</th>
              <th className="pb-3 font-medium">Ventes</th>
              <th className="pb-3 font-medium">Revenus</th>
              <th className="pb-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {myCourses.map(course => (
              <tr key={course.id}>
                <td className="py-4 font-medium text-slate-800">{course.title}</td>
                <td className="py-4 text-slate-600">{course.sales}</td>
                <td className="py-4 font-bold text-green-600">{course.revenue} Coins</td>
                <td className="py-4 text-right">
                  <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">Gérer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Avis Privés des Étudiants */}
      <div className="bg-slate-50 p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
          🔒 Avis Privés des Étudiants
        </h3>
        <p className="text-sm text-slate-500 mb-6">
          Ces commentaires vous sont envoyés de manière confidentielle pour vous aider à vous améliorer. Ils ne sont visibles que par vous et l'administration.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-slate-900">Cours: Développement Flutter</span>
              <span className="text-yellow-500 font-bold">⭐⭐⭐⭐⭐</span>
            </div>
            <p className="text-slate-600 text-sm italic">
              "Excellent cours ! Les explications sur la gestion d'état avec Provider sont très claires. Merci beaucoup."
            </p>
            <div className="text-xs text-slate-400 mt-2 text-right">- Étudiant Anonyme</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-slate-900">Cours: Développement Flutter</span>
              <span className="text-yellow-500 font-bold">⭐⭐⭐⭐</span>
            </div>
            <p className="text-slate-600 text-sm italic">
              "Très bon contenu. J'aurais aimé un peu plus d'exercices pratiques à la fin du chapitre 3, mais globalement top."
            </p>
            <div className="text-xs text-slate-400 mt-2 text-right">- Étudiant Anonyme</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- VUE ADMIN ---
function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-600 p-6 rounded-2xl shadow-sm text-white">
          <div className="opacity-80 mb-1">Chiffre d'affaires (Commission 20%)</div>
          <div className="text-3xl font-bold">2,900,000 Coins</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="text-slate-500 mb-1">Total Utilisateurs</div>
          <div className="text-3xl font-bold text-slate-900">5,120</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="text-slate-500 mb-1">Total Cours Actifs</div>
          <div className="text-3xl font-bold text-slate-900">534</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Dernières inscriptions utilisateurs</h3>
        <p className="text-slate-500 text-sm">Interface de gestion des utilisateurs en construction...</p>
      </div>
    </div>
  )
}


export default function Dashboard() {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Accès refusé</h2>
        <p className="text-slate-500">Veuillez vous connecter pour voir votre tableau de bord.</p>
      </div>
    )
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Bonjour, {user.name} 👋
        </h1>
        <p className="text-slate-600">
          {user.role === "student" && "Prêt à apprendre de nouvelles choses aujourd'hui ?"}
          {user.role === "instructor" && "Voici le résumé de votre activité de formateur."}
          {user.role === "admin" && "Vue globale de la plateforme e-Qraa."}
        </p>
      </div>

      {user.role === "student" && <StudentDashboard user={user} />}
      {user.role === "instructor" && <InstructorDashboard user={user} />}
      {user.role === "admin" && <AdminDashboard />}
      
    </div>
  )
}
