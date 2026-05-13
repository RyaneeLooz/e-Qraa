import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { enrollmentsAPI, coursesAPI, usersAPI } from "../services/api"
import { useGlobalToast } from "../App"
import CourseForm from "../components/CourseForm"
import Spinner from "../components/Spinner"

// ─────────────────────────────────────────────────────────────
// VUE ÉTUDIANT
// ─────────────────────────────────────────────────────────────
function StudentDashboard({ user }) {
  const { coins, addCoins, refreshUser } = useAuth()
  const toast = useGlobalToast()
  const [showPacks, setShowPacks]   = useState(false)
  const [promoCodeInput, setPromoCodeInput] = useState("")
  const [isActivating, setIsActivating] = useState(false)
  const [courses, setCourses]       = useState([])
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    Promise.all([
      enrollmentsAPI.getMyCourses(),
      usersAPI.getLeaderboard()
    ])
      .then(([myCourses, board]) => {
        setCourses(myCourses)
        setLeaderboard(board)
      })
      .catch(() => {
        setCourses([])
        setLeaderboard([])
      })
      .finally(() => setLoading(false))
  }, [])


  const coinPacks = [
    { coins: 1490, price: "1200 DA", label: "Pack Découverte" },
    { coins: 3990, price: "2900 DA", bonus: "Plus Populaire", label: "+990 offerts" },
    { coins: 9990, price: "6500 DA", bonus: "Meilleure Valeur", label: "+3490 offerts" },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Solde Coins */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
          <div className="text-slate-500 mb-1 text-sm font-medium">Mon Solde</div>
          <div className="flex items-center gap-3 text-3xl font-bold text-yellow-500 mb-8 mt-2">
            <span>🟡</span><span>{coins}</span>
          </div>
          <button
            onClick={() => setShowPacks(!showPacks)}
            className="mt-auto py-2 w-full bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-medium transition-colors"
          >
            Recharger mes Coins
          </button>
        </div>

        {/* Gamification */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-2xl shadow-sm text-white">
          <div className="opacity-80 mb-1 text-sm font-medium">USTHB - Info</div>
          <div className="text-3xl font-bold flex items-center gap-2">
            🏆 3ème <span className="text-lg font-normal opacity-80">/ 450</span>
          </div>
          <p className="mt-4 text-sm text-blue-100">Encore 251 points pour passer 2ème !</p>
        </div>

        {/* Inscriptions */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="text-slate-500 mb-1">Mes Inscriptions</div>
          {loading ? (
            <div className="flex items-center gap-2 mt-2"><Spinner size="sm" /> <span className="text-slate-400 text-sm">Chargement...</span></div>
          ) : (
            <div className="text-3xl font-bold text-slate-900">{courses.length}</div>
          )}
          <p className="mt-4 text-sm text-slate-600">Cours en cours ou terminés.</p>
        </div>
      </div>

      {/* Packs Coins */}
      {showPacks && (
        <div className="bg-yellow-50 p-6 rounded-2xl border border-yellow-200">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Recharger mes e-Qraa Coins</h3>
              <p className="text-sm text-slate-600 mt-1">Solde crédité instantanément, 24h/24 et 7j/7.</p>
            </div>
            <div className="w-full lg:w-auto bg-white p-3 rounded-xl border border-yellow-300 shadow-sm">
              <div className="text-xs font-bold text-slate-500 uppercase mb-2">Option 1 : Carte Prépayée</div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Code promo (ex: QRAA-XXXXX)"
                  value={promoCodeInput}
                  onChange={(e) => setPromoCodeInput(e.target.value)}
                  className="w-full sm:w-64 px-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <button
                  onClick={async () => {
                    if (!promoCodeInput) return
                    setIsActivating(true)
                    try {
                      const data = await promosAPI.use(promoCodeInput)
                      toast.success(data.message)
                      await refreshUser()
                      setPromoCodeInput("")
                      setShowPacks(false)
                    } catch (err) {
                      toast.error(err.message)
                    } finally {
                      setIsActivating(false)
                    }
                  }}
                  disabled={isActivating}
                  className="px-4 py-2 bg-slate-900 text-white font-bold text-sm rounded-lg hover:bg-slate-800 whitespace-nowrap transition-colors disabled:opacity-50"
                >
                  {isActivating ? "..." : "Activer"}
                </button>
              </div>
            </div>
          </div>
          <div className="text-xs font-bold text-slate-500 uppercase mb-3">Option 2 : Paiement par carte Edahabia / CIB</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {coinPacks.map((pack, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-yellow-100 flex items-center justify-between hover:border-yellow-400 cursor-pointer transition-colors relative group">
                {pack.bonus && (
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">{pack.bonus}</span>
                )}
                <div>
                  <div className="font-bold text-lg text-yellow-500">{pack.coins} 🟡</div>
                  <div className="text-sm font-bold text-slate-900">{pack.price}</div>
                  <div className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">{pack.label}</div>
                </div>
                <button
                  onClick={() => { alert(`Redirection vers Chargily pour ${pack.price}`); setShowPacks(false) }}
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
        {/* Mes cours */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 lg:col-span-2">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Mes cours actuels</h3>
          {loading ? (
            <div className="flex justify-center py-8"><Spinner size="md" /></div>
          ) : courses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-500 text-sm mb-4">Vous n'êtes inscrit à aucun cours.</p>
              <Link to="/courses" className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition">
                Découvrir les cours
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {courses.map((course) => (
                <div key={course.id} className="p-4 border border-slate-100 rounded-xl flex justify-between items-center bg-slate-50">
                  <div>
                    <span className="font-medium text-slate-800">{course.title}</span>
                    <div className="text-xs text-slate-400 mt-1">{course.instructor_name}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-slate-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: "60%" }} />
                    </div>
                    <span className="text-sm font-bold text-slate-600">60%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Classement */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-1">Classement</h3>
          <p className="text-xs text-slate-500 mb-4">Informatique - USTHB</p>
          <div className="space-y-3">
            {leaderboard.length === 0 ? (
              <p className="text-slate-400 text-xs text-center py-4 italic">Pas encore de classement.</p>
            ) : (
              leaderboard.map((student, idx) => (
                <div
                  key={student.id}
                  className={`flex items-center justify-between p-3 rounded-xl border ${
                    student.id === user.id ? "bg-blue-50 border-blue-200 ring-1 ring-blue-600" : "bg-white border-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`font-bold w-5 text-center ${
                      idx === 0 ? "text-yellow-500" :
                      idx === 1 ? "text-slate-400" :
                      idx === 2 ? "text-orange-400" : "text-slate-400"
                    }`}>{idx + 1}</span>
                    <span className={`font-medium ${student.id === user.id ? "text-blue-900" : "text-slate-700"}`}>
                      {student.name} {student.id === user.id && "(Moi)"}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-slate-600">{student.points} pts</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// VUE FORMATEUR
// ─────────────────────────────────────────────────────────────
function InstructorDashboard({ user }) {
  const toast = useGlobalToast()
  const [showCourseForm, setShowCourseForm] = useState(false)
  const [myCourses, setMyCourses]           = useState([])
  const [stats, setStats]                   = useState(null)
  const [loading, setLoading]               = useState(true)

  useEffect(() => {
    Promise.all([
      coursesAPI.getAll(),         // On filtre côté client ceux du formateur
      enrollmentsAPI.getInstructorStats(),
    ])
      .then(([courses, s]) => {
        // Filtrer les cours de ce formateur (l'API retourne tous les cours publics)
        // Le backend filtre via instructor_id dans getInstructorStats
        setStats(s)
        setMyCourses(courses.filter(c => c.instructor_id === user.id))
      })
      .catch(() => {
        setStats({ total_students: 0, total_courses: 0, total_earnings: 0 })
      })
      .finally(() => setLoading(false))
  }, [user.id])

  const handleCreateCourse = async (data) => {
    try {
      const formData = new FormData()
      Object.entries(data).forEach(([key, val]) => { if (val) formData.append(key, val) })
      await coursesAPI.create(formData)
      toast.success("Cours créé avec succès !")
      setShowCourseForm(false)
      // Recharger les cours
      const courses = await coursesAPI.getAll()
      setMyCourses(courses.filter(c => c.instructor_id === user.id))
    } catch (err) {
      toast.error(err.message || "Erreur lors de la création du cours.")
    }
  }

  if (showCourseForm) {
    return (
      <CourseForm
        onSubmit={handleCreateCourse}
        onCancel={() => setShowCourseForm(false)}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="text-slate-500 mb-1">Revenus Nets (80%)</div>
          {loading ? <Spinner size="sm" /> : (
            <div className="text-3xl font-bold text-green-600">
              {stats?.total_earnings?.toLocaleString() ?? 0} Coins
            </div>
          )}
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="text-slate-500 mb-1">Mes Cours</div>
          {loading ? <Spinner size="sm" /> : (
            <div className="text-3xl font-bold text-slate-900">{stats?.total_courses ?? 0}</div>
          )}
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="text-slate-500 mb-1">Total Étudiants</div>
          {loading ? <Spinner size="sm" /> : (
            <div className="text-3xl font-bold text-blue-600">{stats?.total_students ?? 0}</div>
          )}
        </div>
      </div>

      {/* Bannière vérification */}
      {!user.is_verified && (
        <div className="bg-orange-50 border border-orange-200 p-6 rounded-2xl flex flex-col md:flex-row items-center gap-4 animate-pulse">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-2xl">⏳</div>
          <div className="flex-1 text-center md:text-left">
            <h4 className="font-bold text-orange-800">Compte en cours de vérification</h4>
            <p className="text-sm text-orange-700">
              Nos administrateurs examinent vos documents. Vous pourrez publier vos cours dès validation (généralement sous 24h).
            </p>
          </div>
          <div className="text-xs font-bold bg-orange-200 text-orange-800 px-3 py-1 rounded-full uppercase">
            Statut: En attente
          </div>
        </div>
      )}

      {/* Tableau des cours */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-900">Mes Cours publiés</h3>
          <button
            onClick={() => user.is_verified
              ? setShowCourseForm(true)
              : toast.warning("Votre compte doit être vérifié avant de créer un cours.")
            }
            className={`px-4 py-2 text-white text-sm font-medium rounded-xl transition ${
              user.is_verified ? "bg-blue-600 hover:bg-blue-700" : "bg-slate-300 cursor-not-allowed"
            }`}
          >
            + Créer un cours
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8"><Spinner size="md" /></div>
        ) : myCourses.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-8">Aucun cours publié pour l'instant.</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="text-sm text-slate-500 border-b border-slate-200">
                <th className="pb-3 font-medium">Titre</th>
                <th className="pb-3 font-medium">Prix</th>
                <th className="pb-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {myCourses.map((course) => (
                <tr key={course.id}>
                  <td className="py-4 font-medium text-slate-800">{course.title}</td>
                  <td className="py-4 font-bold text-yellow-600">
                    {course.price === 0 ? <span className="text-green-600">Gratuit</span> : `${course.price} Coins`}
                  </td>
                  <td className="py-4 text-right">
                    <Link to={`/courses/${course.id}`} className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                      Gérer →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Avis Privés */}
      <div className="bg-slate-50 p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">🔒 Avis Privés des Étudiants</h3>
        <p className="text-sm text-slate-500 mb-6">
          Ces commentaires vous sont envoyés de manière confidentielle. Ils ne sont visibles que par vous et l'administration.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { stars: "⭐⭐⭐⭐⭐", text: "Excellent cours ! Les explications sont très claires. Merci beaucoup." },
            { stars: "⭐⭐⭐⭐", text: "Très bon contenu. J'aurais aimé plus d'exercices pratiques à la fin." },
          ].map((review, i) => (
            <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-slate-900">Avis #{i + 1}</span>
                <span className="text-yellow-500 font-bold">{review.stars}</span>
              </div>
              <p className="text-slate-600 text-sm italic">"{review.text}"</p>
              <div className="text-xs text-slate-400 mt-2 text-right">- Étudiant Anonyme</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// VUE ADMIN
// ─────────────────────────────────────────────────────────────
function AdminDashboard() {
  const toast = useGlobalToast()
  const [stats, setStats]                   = useState(null)
  const [pendingInstructors, setPending]    = useState([])
  const [loading, setLoading]               = useState(true)

  useEffect(() => {
    Promise.all([
      enrollmentsAPI.getAdminStats(),
      usersAPI.getPendingInstructors(),
    ])
      .then(([s, instructors]) => { setStats(s); setPending(instructors) })
      .catch(() => setStats(null))
      .finally(() => setLoading(false))
  }, [])

  const handleVerify = async (instructorId) => {
    try {
      await usersAPI.verifyInstructor(instructorId)
      setPending((prev) => prev.filter(i => i.id !== instructorId))
      toast.success("Formateur vérifié avec succès !")
    } catch (err) {
      toast.error(err.message || "Erreur lors de la vérification.")
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-600 p-6 rounded-2xl shadow-sm text-white">
          <div className="opacity-80 mb-1">Commission Plateforme (20%)</div>
          {loading ? <Spinner size="sm" color="white" /> : (
            <div className="text-3xl font-bold">{stats?.total_commission?.toLocaleString() ?? 0} Coins</div>
          )}
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="text-slate-500 mb-1">Total Utilisateurs</div>
          {loading ? <Spinner size="sm" /> : (
            <div className="text-3xl font-bold text-slate-900">{stats?.total_users ?? "—"}</div>
          )}
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="text-slate-500 mb-1">Total Cours Actifs</div>
          {loading ? <Spinner size="sm" /> : (
            <div className="text-3xl font-bold text-slate-900">{stats?.total_courses ?? "—"}</div>
          )}
        </div>
      </div>

      {/* Formateurs en attente */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          ⏳ Formateurs en attente de vérification
          {pendingInstructors.length > 0 && (
            <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-full">
              {pendingInstructors.length}
            </span>
          )}
        </h3>
        {loading ? (
          <div className="flex justify-center py-8"><Spinner size="md" /></div>
        ) : pendingInstructors.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-6">✓ Aucun formateur en attente de vérification.</p>
        ) : (
          <div className="space-y-3">
            {pendingInstructors.map((instructor) => (
              <div key={instructor.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <p className="font-bold text-slate-900">{instructor.name}</p>
                  <p className="text-sm text-slate-500">{instructor.email}</p>
                </div>
                <button
                  onClick={() => handleVerify(instructor.id)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl transition"
                >
                  ✓ Vérifier
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Accès refusé</h2>
        <p className="text-slate-500">Veuillez vous connecter pour voir votre tableau de bord.</p>
        <Link to="/login" className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition">
          Se connecter
        </Link>
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
          {user.role === "student"    && "Prêt à apprendre de nouvelles choses aujourd'hui ?"}
          {user.role === "instructor" && "Voici le résumé de votre activité de formateur."}
          {user.role === "admin"      && "Vue globale de la plateforme e-Qraa."}
        </p>
      </div>

      {user.role === "student"    && <StudentDashboard user={user} />}
      {user.role === "instructor" && <InstructorDashboard user={user} />}
      {user.role === "admin"      && <AdminDashboard />}
    </div>
  )
}
