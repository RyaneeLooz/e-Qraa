import { useState } from "react"

const MOCK_PENDING_INSTRUCTORS = [
  { id: 1, name: "Mohamed Saidi", email: "m.saidi@univ-alger.dz", specialty: "Intelligence Artificielle", idCard: "PROF-2024-0891", date: "2026-05-05" },
  { id: 2, name: "Amira Boudiaf", email: "a.boudiaf@esi.dz", specialty: "Cybersécurité", idCard: "PROF-2024-1204", date: "2026-05-06" },
  { id: 3, name: "Youcef Hamdi", email: "y.hamdi@gmail.com", specialty: "Marketing Digital", idCard: "DIPL-2023-3321", date: "2026-05-07" },
]

const MOCK_USERS = [
  { id: 1, name: "Ahmed B.", email: "ahmed@mail.com", role: "student", status: "Actif", coins: 3490, joined: "2026-01-15" },
  { id: 2, name: "Sarah Kadi", email: "sarah@esi.dz", role: "instructor", status: "Vérifié", coins: 0, joined: "2025-11-20" },
  { id: 3, name: "Lina Dahmani", email: "lina@design.dz", role: "instructor", status: "Vérifié", coins: 0, joined: "2025-12-01" },
  { id: 4, name: "Fatima Z.", email: "fatima@mail.com", role: "student", status: "Actif", coins: 1490, joined: "2026-02-10" },
  { id: 5, name: "Karim Ziani", email: "karim@data.dz", role: "instructor", status: "Vérifié", coins: 0, joined: "2026-01-05" },
  { id: 6, name: "Nour H.", email: "nour@mail.com", role: "student", status: "Actif", coins: 790, joined: "2026-03-22" },
]

const MOCK_PROMO_CODES = [
  { id: 1, code: "QRAA-WELCOME", coins: 500, used: 145, max: 500, status: "Actif" },
  { id: 2, code: "QRAA-SUMMER26", coins: 1000, used: 23, max: 100, status: "Actif" },
  { id: 3, code: "QRAA-BETA2025", coins: 300, used: 200, max: 200, status: "Expiré" },
]

export default function Admin() {
  const [activeTab, setActiveTab] = useState("overview")
  const [pendingInstructors, setPendingInstructors] = useState(MOCK_PENDING_INSTRUCTORS)
  const [users] = useState(MOCK_USERS)
  const [promoCodes, setPromoCodes] = useState(MOCK_PROMO_CODES)
  const [newPromo, setNewPromo] = useState({ code: "", coins: "", max: "" })

  const handleVerify = (id) => {
    setPendingInstructors(prev => prev.filter(i => i.id !== id))
    alert("Formateur vérifié avec succès ! Il peut maintenant publier des cours.")
  }

  const handleReject = (id) => {
    setPendingInstructors(prev => prev.filter(i => i.id !== id))
    alert("Demande refusée. Le formateur sera notifié par email.")
  }

  const handleCreatePromo = (e) => {
    e.preventDefault()
    if (!newPromo.code || !newPromo.coins || !newPromo.max) return
    setPromoCodes(prev => [...prev, {
      id: Date.now(),
      code: newPromo.code.toUpperCase(),
      coins: parseInt(newPromo.coins),
      used: 0,
      max: parseInt(newPromo.max),
      status: "Actif"
    }])
    setNewPromo({ code: "", coins: "", max: "" })
    alert("Code promo créé avec succès !")
  }

  const tabs = [
    { key: "overview", label: "Vue d'ensemble", icon: "📊" },
    { key: "instructors", label: "Formateurs en attente", icon: "👨‍🏫", badge: pendingInstructors.length },
    { key: "users", label: "Utilisateurs", icon: "👥" },
    { key: "promos", label: "Codes Promo", icon: "🎟️" },
  ]

  // Stats
  const totalStudents = users.filter(u => u.role === "student").length
  const totalInstructors = users.filter(u => u.role === "instructor").length
  const totalCoinsCirculation = users.reduce((sum, u) => sum + u.coins, 0)
  const platformRevenue = 67200 // Mock: 20% commission

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
              <div className="text-slate-500 text-sm mb-1">Étudiants inscrits</div>
              <div className="text-3xl font-bold text-blue-600">{totalStudents}</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="text-slate-500 text-sm mb-1">Formateurs vérifiés</div>
              <div className="text-3xl font-bold text-green-600">{totalInstructors}</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="text-slate-500 text-sm mb-1">Coins en circulation</div>
              <div className="text-3xl font-bold text-yellow-500">{totalCoinsCirculation.toLocaleString()} 🟡</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="text-slate-500 text-sm mb-1">Revenus Plateforme (20%)</div>
              <div className="text-3xl font-bold text-emerald-600">{platformRevenue.toLocaleString()} Coins</div>
            </div>
          </div>

          {/* Activité récente */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Activité récente</h3>
            <div className="space-y-3">
              {[
                { icon: "🟢", text: "Ahmed B. a acheté 'React pour les débutants'", time: "Il y a 2 min" },
                { icon: "💳", text: "Fatima Z. a rechargé 3990 Coins (Pack Plus Populaire)", time: "Il y a 15 min" },
                { icon: "⭐", text: "Nour H. a laissé un avis sur Sarah Kadi", time: "Il y a 1h" },
                { icon: "📝", text: "Mohamed Saidi a soumis une demande de formateur", time: "Il y a 3h" },
                { icon: "🎟️", text: "Code QRAA-SUMMER26 utilisé par 3 étudiants", time: "Il y a 5h" },
              ].map((activity, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{activity.icon}</span>
                    <span className="text-sm text-slate-700">{activity.text}</span>
                  </div>
                  <span className="text-xs text-slate-400 whitespace-nowrap">{activity.time}</span>
                </div>
              ))}
            </div>
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
                        📚 {instructor.specialty}
                      </span>
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-lg font-medium">
                        🪪 {instructor.idCard}
                      </span>
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-lg font-medium">
                        📅 {instructor.date}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReject(instructor.id)}
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
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-sm text-slate-500 border-b border-slate-200">
                <th className="px-6 py-4 font-medium">Utilisateur</th>
                <th className="px-6 py-4 font-medium">Rôle</th>
                <th className="px-6 py-4 font-medium">Statut</th>
                <th className="px-6 py-4 font-medium">Coins</th>
                <th className="px-6 py-4 font-medium">Inscrit le</th>
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
                      u.status === "Actif" || u.status === "Vérifié" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-yellow-600">{u.coins.toLocaleString()} 🟡</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{u.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ===== CODES PROMO ===== */}
      {activeTab === "promos" && (
        <div className="space-y-6">
          {/* Créer un code */}
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
                placeholder="Limite d'utilisations"
                value={newPromo.max}
                onChange={(e) => setNewPromo({...newPromo, max: e.target.value})}
                className="w-48 px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                + Créer
              </button>
            </form>
          </div>

          {/* Liste des codes */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-sm text-slate-500 border-b border-slate-200">
                  <th className="px-6 py-4 font-medium">Code</th>
                  <th className="px-6 py-4 font-medium">Coins offerts</th>
                  <th className="px-6 py-4 font-medium">Utilisations</th>
                  <th className="px-6 py-4 font-medium">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {promoCodes.map(promo => (
                  <tr key={promo.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-slate-900">{promo.code}</td>
                    <td className="px-6 py-4 font-bold text-yellow-600">{promo.coins} 🟡</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden max-w-[120px]">
                          <div
                            className={`h-full rounded-full ${promo.used >= promo.max ? "bg-red-400" : "bg-blue-500"}`}
                            style={{ width: `${Math.min((promo.used / promo.max) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-slate-500">{promo.used}/{promo.max}</span>
                      </div>
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
