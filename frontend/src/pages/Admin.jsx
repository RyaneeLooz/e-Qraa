import { useState, useEffect } from "react"
import { enrollmentsAPI, usersAPI, promosAPI } from "../services/api"
import Spinner from "../components/Spinner"
import { useGlobalToast } from "../App"

export default function Admin() {
  const toast = useGlobalToast()
  const [activeTab, setActiveTab] = useState("overview")
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [pendingInstructors, setPendingInstructors] = useState([])
  const [users, setUsers] = useState([])
  const [promoCodes, setPromoCodes] = useState([])
  const [newPromo, setNewPromo] = useState({ code: "", coins: "", max: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [adminStats, pending, allUsers, promos] = await Promise.all([
        enrollmentsAPI.getAdminStats(),
        usersAPI.getPendingInstructors(),
        usersAPI.getAll(),
        promosAPI.getAll()
      ])
      setStats(adminStats)
      setPendingInstructors(pending)
      setUsers(allUsers)
      setPromoCodes(promos)
    } catch (err) {
      toast.error("Erreur lors du chargement des données admin")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleVerify = async (id) => {
    try {
      await usersAPI.verifyInstructor(id)
      setPendingInstructors(prev => prev.filter(i => i.id !== id))
      toast.success("Formateur vérifié avec succès !")
      fetchData() // Refresh stats
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleCreatePromo = async (e) => {
    e.preventDefault()
    if (!newPromo.code || !newPromo.coins || !newPromo.max) return
    setIsSubmitting(true)
    try {
      await promosAPI.create({
        code: newPromo.code.toUpperCase(),
        coins: parseInt(newPromo.coins),
        max_uses: parseInt(newPromo.max)
      })
      setNewPromo({ code: "", coins: "", max: "" })
      toast.success("Code promo créé avec succès !")
      fetchData()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const tabs = [
    { key: "overview", label: "Vue d'ensemble", icon: "📊" },
    { key: "instructors", label: "Formateurs en attente", icon: "👨‍🏫", badge: pendingInstructors.length },
    { key: "users", label: "Utilisateurs", icon: "👥" },
    { key: "promos", label: "Codes Promo", icon: "🎟️" },
  ]

  if (loading) return <div className="py-20 flex justify-center"><Spinner size="lg" /></div>

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Administration e-Qraa</h1>
        <p className="text-slate-500">Gérez la plateforme, validez les formateurs et suivez les performances.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.key
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
            {tab.badge > 0 && (
              <span className={`ml-1 w-5 h-5 text-xs font-bold rounded-full flex items-center justify-center ${
                activeTab === tab.key ? "bg-white text-blue-600" : "bg-red-500 text-white"
              }`}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ===== VUE D'ENSEMBLE ===== */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="text-slate-500 text-sm mb-1">Total Utilisateurs</div>
              <div className="text-3xl font-bold text-blue-600">{stats?.total_users || 0}</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="text-slate-500 text-sm mb-1">Cours Publiés</div>
              <div className="text-3xl font-bold text-green-600">{stats?.total_courses || 0}</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="text-slate-500 text-sm mb-1">Revenus Plateforme (20%)</div>
              <div className="text-3xl font-bold text-emerald-600">{stats?.total_commission || 0} 🟡</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="text-slate-500 text-sm mb-1">En attente</div>
              <div className="text-3xl font-bold text-orange-500">{pendingInstructors.length}</div>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
            <h3 className="text-lg font-bold text-blue-900 mb-2">Bienvenue dans votre panel admin</h3>
            <p className="text-blue-700 text-sm">
              Toutes les données affichées ici sont synchronisées en temps réel avec la base de données PostgreSQL.
            </p>
          </div>
        </div>
      )}

      {/* ===== FORMATEURS EN ATTENTE ===== */}
      {activeTab === "instructors" && (
        <div className="space-y-4">
          {pendingInstructors.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-200 text-center">
              <span className="text-5xl mb-4 block">✅</span>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Aucune demande en attente</h3>
              <p className="text-slate-500">Toutes les demandes de formateurs ont été traitées.</p>
            </div>
          ) : (
            pendingInstructors.map(instructor => (
              <div key={instructor.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-lg font-bold text-blue-600">
                        {instructor.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{instructor.name}</h4>
                        <p className="text-xs text-slate-500">{instructor.email}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-3">
                      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-lg font-medium">
                        📚 {instructor.specialty || "Expert"}
                      </span>
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-lg font-medium">
                        🪪 {instructor.id_card_number || "N/A"}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="px-4 py-2 border border-red-200 text-red-600 text-sm font-bold rounded-xl hover:bg-red-50 transition-colors"
                    >
                      ✕ Refuser
                    </button>
                    <button
                      onClick={() => handleVerify(instructor.id)}
                      className="px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-xl hover:bg-green-700 transition-colors shadow-sm"
                    >
                      ✓ Vérifier
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ===== UTILISATEURS ===== */}
      {activeTab === "users" && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-sm text-slate-500 border-b border-slate-200">
                <th className="px-6 py-4 font-medium">Utilisateur</th>
                <th className="px-6 py-4 font-medium">Rôle</th>
                <th className="px-6 py-4 font-medium">Statut</th>
                <th className="px-6 py-4 font-medium">Coins</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{u.name}</div>
                    <div className="text-xs text-slate-400">{u.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                      u.role === "student" ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"
                    }`}>
                      {u.role === "student" ? "🎓 Étudiant" : "👨‍🏫 Formateur"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      u.is_verified ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                    }`}>
                      {u.is_verified ? "Vérifié" : "En attente"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-yellow-600">{u.coins?.toLocaleString()} 🟡</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ===== CODES PROMO ===== */}
      {activeTab === "promos" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Créer un code promo</h3>
            <form onSubmit={handleCreatePromo} className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                placeholder="QRAA-XXXXX"
                value={newPromo.code}
                onChange={(e) => setNewPromo({...newPromo, code: e.target.value})}
                className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase font-mono text-sm"
              />
              <input
                type="number"
                placeholder="Coins offerts"
                value={newPromo.coins}
                onChange={(e) => setNewPromo({...newPromo, coins: e.target.value})}
                className="w-40 px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <input
                type="number"
                placeholder="Limite"
                value={newPromo.max}
                onChange={(e) => setNewPromo({...newPromo, max: e.target.value})}
                className="w-40 px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Création..." : "+ Créer"}
              </button>
            </form>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-sm text-slate-500 border-b border-slate-200">
                  <th className="px-6 py-4 font-medium">Code</th>
                  <th className="px-6 py-4 font-medium">Coins</th>
                  <th className="px-6 py-4 font-medium">Utilisations</th>
                  <th className="px-6 py-4 font-medium">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {promoCodes.map(promo => (
                  <tr key={promo.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-slate-900">{promo.code}</td>
                    <td className="px-6 py-4 font-bold text-yellow-600">{promo.coins} 🟡</td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {promo.used_count} / {promo.max_uses}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        promo.status === "Actif" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
                      }`}>
                        {promo.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
