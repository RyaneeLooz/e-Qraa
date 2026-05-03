import { useAuth } from "../context/AuthContext"

export default function Navbar({ page, setPage }) {
  const { user, logout } = useAuth()

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 px-6">
      <div className="max-w-7xl mx-auto flex items-center gap-4 h-16">
        
        {/* Logo */}
        <div
          onClick={() => setPage("home")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">Q</span>
          </div>
          <span className="font-bold text-lg text-slate-900">
            e-<span className="text-blue-600">Qraa</span>
          </span>
        </div>

        {/* Liens */}
        <div className="flex gap-1 ml-4">
          {[
            { key: "home", label: "Accueil" },
            { key: "courses", label: "Cours" },
            { key: "instructors", label: "Formateurs" },
            { key: "about", label: "À propos" },
          ].map((link) => (
            <button
              key={link.key}
              onClick={() => setPage(link.key)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                page === link.key
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Barre de recherche */}
        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="Rechercher cours, formateurs..."
            className="w-full px-4 py-2 text-sm border border-slate-200 rounded-full focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Auth buttons */}
        <div className="flex gap-2 ml-auto">
          {user ? (
            <>
              <button
                onClick={() => setPage("dashboard")}
                className="px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                👤 {user.name.split(" ")[0]}
              </button>
              <button
                onClick={() => { logout(); setPage("home") }}
                className="px-4 py-2 text-sm font-medium border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setPage("login")}
                className="px-4 py-2 text-sm font-medium border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
              >
                Connexion
              </button>
              <button
                onClick={() => setPage("register")}
                className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                S'inscrire
              </button>
            </>
          )}
        </div>

      </div>
    </nav>
  )
}